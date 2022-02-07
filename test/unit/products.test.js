const productController = require('../../controller/products');
const productModel = require('../../models/product');
const httpMocks = require('node-mocks-http');
const newProduct = require('../data/new-product.json');

productModel.create = jest.fn();

let req, res, next;
req = httpMocks.createRequest();
res = httpMocks.createResponse();

req.body = newProduct;

describe("Product Controller Create", () => {
  it("should have a createProduct function", () => {
    expect(typeof productController.createProduct).toBe("function")
  })
  it("should call ProductModel.create", () => {
    productController.createProduct(req, res, next);
    // toBeCalledWith: 인자로 무엇이 넘어 왔는지를 검증할 수 있다.
    expect(productModel.create).toBeCalledWith(newProduct);
    // toBeCalled : 잘못된 Matcher 사용 시, 아래 에러 발생
    // Matcher error: this matcher must not have an expected argument

  })
})