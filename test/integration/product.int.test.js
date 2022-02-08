const request = require('supertest');
const app = require('../../index');
const newProduct = require('../data/new-product.json');
// console.log('newProduct: ', newProduct);
// const newProduct = require('../data/new-product.json')

describe("Product Integration Create", () => {
  it("POST /api/products", async () => {
    const response = await request(app)
      .post("/api/products")
      .send(newProduct);
    // console.log('response: ', response);
    expect(response.statusCode).toBe(201)
    expect(response.body.name).toBe(newProduct.name)
    expect(response.body.description).toBe(newProduct.description)
  })

  it("should return 500 on POST /api/products", async () => {
    const response = await request(app)
      .post('/api/products')
      // 에러: connect ECONNREFUSED 127.0.0.1:80
      // 해결: .post('api/products') 를 .post('/api/products')
      .send({ name: "phone" });
    expect(response.statusCode).toBe(500)
    // console.log('response.body', response.body);
    // expect(response.body).toStrictEqual({ message: "" })
    // 콘솔에 찍힌 에러를 넣어준다.
    expect(response.body).toStrictEqual({ message: "Product validation failed: description: Path `description` is required." })
  })
})

