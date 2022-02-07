const productController = require('../../controller/products');
const productModel = require('../../models/product');
const httpMocks = require('node-mocks-http');
const newProduct = require('../data/new-product.json');

productModel.create = jest.fn();

let req, res, next;
beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = null;
})

describe("Product Controller Create", () => {
  // create 에서만 사용될 newProduct
  beforeEach(() => {
    req.body = newProduct;
  })
  // type 이 함수인지 확인
  it("should have a createProduct function", () => {
    expect(typeof productController.createProduct).toBe("function")
  })
  // 모델의 create 실행 시, 넘겨받은 값을 확인
  it("should call ProductModel.create", () => {
    productController.createProduct(req, res, next);
    // toBeCalledWith: 인자로 무엇이 넘어 왔는지를 검증할 수 있다.
    expect(productModel.create).toBeCalledWith(newProduct);
    // toBeCalled : 잘못된 Matcher 사용 시, 아래 에러 발생
    // Matcher error: this matcher must not have an expected argument
  })
  // 상태 값 확인: 같은지 확인
  // 응답 값 확인: 전송 됐는지 확인
  it("should return 201 response code", () => {
    productController.createProduct(req, res, next);
    expect(res.statusCode).toBe(201);
    expect(res._isEndCalled()).toBeTruthy();
  })
  // 응답 값 반환: json => send 로 test 해보기 TODO:node-mocks-http
  it("should return json body in response", () => {
    productModel.create.mockReturnValue(newProduct);
    productController.createProduct(req, res, next);
    expect(res._getJSONData()).toStrictEqual(newProduct);
  })
})