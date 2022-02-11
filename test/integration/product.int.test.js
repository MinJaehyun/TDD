const request = require('supertest');
const app = require('../../index');
const newProduct = require('../data/new-product.json');
let firstProduct;

// create
it("POST /api/products", async () => {
  const response = await request(app)
    .post("/api/products")
    .send(newProduct);
  // console.log('response: ', response);
  expect(response.statusCode).toBe(201)
  expect(response.body.name).toBe(newProduct.name)
  expect(response.body.description).toBe(newProduct.description)
})

// create
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

// read
it("GET /api/products", async () => {
  const response = await request(app).get('/api/products');
  // console.log('response: ', response.body[0]);                 // 6201ef110260a022ede7d188
  expect(response.statusCode).toBe(200);
  expect(Array.isArray(response.body)).toBeTruthy();
  expect(response.body[0].name).toBeDefined();
  expect(response.body[0].description).toBeDefined();
  firstProduct = response.body[0];
})

// :productId
it("GET /api/products/:productId", async () => {
  const response = await request(app).get('/api/products/' + firstProduct._id);
  expect(response.statusCode).toBe(200);
  expect(response.body.name).toBe(firstProduct.name);
  expect(response.body.description).toBe(firstProduct.description);
})

// :productId
it("GET id doesn't exitst /api/products/:productId", async () => {
  const response = await request(app).get('/api/products/6201ef110260a022ede7d111');
  expect(response.statusCode).toBe(404);
})

// update
it("PUT /api/products", async () => {
  const res = await request(app)
    .put("/api/products/" + firstProduct._id)
    .send({ name: "update", description: "update" });
  expect(res.statusCode).toBe(200);
  expect(res.body.name).toBe("update");
  expect(res.body.description).toBe("update");
})

// update
it("should return 404 on PUT /api/products", async () => {
  const res = await request(app)
    .put('/api/products/' + "620517b8eb3972e2e21d5811")
    .send({ name: "update", description: "update" });
  expect(res.statusCode).toBe(404);
})

// delete
it("DELETE /api/products", async () => {
  console.log(firstProduct._id);
  const res = await request(app)
    // 에러 해결: "/api/products/" + :id
    .delete("/api/products/" + firstProduct._id)
    .send();
  expect(res.statusCode).toBe(200);
})

it("DELETE id doesn't exist /api/products/:productId", async () => {
  // 통합 테스트는 전체 테스트 한다. 삭제된 id 를 가져오면 없는 id 이므로 에러 처리 테스트를 구현할 수 있다. 
  const res = await request(app)
    .delete("/api/products/" + firstProduct._id)
    .send();
  expect(res.statusCode).toBe(404);
})
