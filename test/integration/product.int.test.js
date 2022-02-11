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
    .put('/api/products' + "620517b8eb3972e2e21d5811")
    .send({ name: "update", description: "update" });
  expect(res.statusCode).toBe(404);
})
