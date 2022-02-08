const request = require('supertest');
const app = require('../../index');
const newProduct = require('../data/new-product.json');
// console.log('newProduct: ', newProduct);
// const newProduct = require('../data/new-product.json')

it("POST /api/products", async () => {
  const response = await request(app)
    .post("/api/products")
    .send(newProduct);
  // console.log('response: ', response);
  expect(response.statusCode).toBe(201)
  expect(response.body.name).toBe(newProduct.name)
  expect(response.body.description).toBe(newProduct.description)
})