const productController = require('../../controller/products');
const productModel = require('../../models/product');
const httpMocks = require('node-mocks-http');
const newProduct = require('../data/new-product.json');
const allProducts = require('../data/all-products.json');

productModel.create = jest.fn();
productModel.find = jest.fn();
productModel.findById = jest.fn();
productModel.findByIdAndUpdate = jest.fn();
productModel.findByIdAndDelete = jest.fn();

const productId = "6201ef110260a022ede7d155"
const updateProduct = { name: "update", description: "update" };

let req, res, next;
beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  req.body = newProduct;
  next = jest.fn();
})

describe("Product Controller Create", () => {
  // create 에서만 사용될 newProduct
  beforeEach(() => {
    // req.body = newProduct;
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
  })
  // 상태 값 확인: 같은지 확인
  // 응답 값 확인: 전송 됐는지 확인
  it("should return 201 response code", async () => {
    await productController.createProduct(req, res, next);
    expect(res.statusCode).toBe(201);
    expect(res._isEndCalled()).toBeTruthy();
  })
  it("should return json body in response", async () => {
    productModel.create.mockReturnValue(newProduct);
    await productController.createProduct(req, res, next);
    expect(res._getJSONData()).toStrictEqual(newProduct);
  })
  // 에러 처리 구현
  it("should handle errors", async () => {
    const errorMessage = { message: "description property missing" };
    const rejectedPromise = Promise.reject(errorMessage);
    productModel.create.mockReturnValue(rejectedPromise);
    await productController.createProduct(req, res, next);
    expect(next).toBeCalledWith(errorMessage);
  })
});

describe("Product Controller Get", () => {
  it("should have a getProducts function", () => {
    expect(typeof productController.getProducts).toBe("function")
  })
  it("should call ProductModel.find({})", async () => {
    await productController.getProducts(req, res, next);
    expect(productModel.find).toHaveBeenCalledWith({})  // toBeCalledWith
  })
  it("should return 200 response", async () => {
    await productController.getProducts(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled).toBeTruthy();
  })
  it("should return json body in response", async () => {
    productModel.find.mockReturnValue(allProducts)
    await productController.getProducts(req, res, next)
    expect(res._getJSONData()).toStrictEqual(allProducts)
  })
  it("should handle errors", async () => {
    const errorMessage = { message: "Error finding product data" }
    const rejectPromise = Promise.reject(errorMessage)
    productModel.find.mockReturnValue(rejectPromise);
    await productController.getProducts(req, res, next);
    expect(next).toHaveBeenCalledWith(errorMessage)
  })
});

describe("Product Controller GetById", () => {
  it("should have a getProductById", () => {
    expect(typeof productController.getProductById).toBe("function")
  })
  it("should call productModel.findById", async () => {
    req.params.productId = productId
    await productController.getProductById(req, res, next);
    expect(productModel.findById).toBeCalledWith(productId);
  })
  it("should return json body and response code 200", async () => {
    productModel.findById.mockReturnValue(newProduct);
    await productController.getProductById(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(newProduct);
    expect(res._isEndCalled()).toBeTruthy();
  })
  it("shold return 404 when item doesn't exist", async () => {
    // 404 를 나타내기 위해, 데이터 값은 null 로 넣는다
    productModel.findById.mockReturnValue(null)
    await productController.getProductById(req, res, next);
    expect(res.statusCode).toBe(404);
    expect(res._isEndCalled()).toBeTruthy();
  })
  it("should handle errors", async () => {
    const errorsMessage = { message: "error" };
    const rejectPromise = Promise.reject(errorsMessage);
    productModel.findById.mockReturnValue(rejectPromise);
    await productController.getProductById(req, res, next);
    expect(next).toHaveBeenCalledWith(errorsMessage);
  })
});

describe("Product Controller Update", () => {
  it("should have an updateProduct function", () => {
    expect(typeof productController.updateProduct).toBe("function");
  })
  it("should call productModel.findByIdAndUpdate", async () => {
    req.params.productId = productId;
    req.body = updateProduct;
    await productController.updateProduct(req, res, next);
    expect(productModel.findByIdAndUpdate).toHaveBeenCalledWith(
      productId, updateProduct, { new: true }
    )
  })
  it("should return json body and response code 200", async () => {
    req.params.productId = productId;
    req.body = updateProduct;
    productModel.findByIdAndUpdate.mockReturnValue(updateProduct);
    await productController.updateProduct(req, res, next);
    expect(res._isEndCalled()).toBeTruthy();
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(updateProduct);
  })
  it("should handle 404 when item doesn't exist", async () => {
    productModel.findByIdAndUpdate.mockReturnValue(null);
    await productController.updateProduct(req, res, next);
    expect(res.statusCode).toBe(404);
    expect(res._isEndCalled()).toBeTruthy();
  })
  it("should handle errors", async () => {
    const errorMessage = { message: "Error" };
    const rejectPromise = Promise.reject(errorMessage);
    productModel.findByIdAndUpdate.mockReturnValue(rejectPromise);
    await productController.updateProduct(req, res, next);
    expect(next).toHaveBeenCalledWith(errorMessage);
  })
})

describe("Product Controller Delete", () => {
  it("should have a deleteProduct function", () => {
    expect(typeof productController.deleteProduct).toBe("function");
  })
  it("should call productModel.findByIdAndDelete", async () => {
    req.params.productId = productId;
    await productController.deleteProduct(req, res, next);
    expect(productModel.findByIdAndDelete).toHaveBeenCalledWith(productId);
  })
  it("should return 200 response", async () => {
    let deleteProduct = {
      name: "delete",
      description: "delete",
    }
    productModel.findByIdAndDelete.mockReturnValue(deleteProduct);
    await productController.deleteProduct(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(deleteProduct);
    expect(res._isEndCalled()).toBeTruthy();
  })
  it("should handle 404 when item doesnt exist", async () => {
    productModel.findByIdAndDelete.mockReturnValue(null);
    await productController.deleteProduct(req, res, next);
    expect(res.statusCode).toBe(404);
    expect(res._isEndCalled).toBeTruthy();
  })
  it("should handle errors", async () => {
    const errorMessage = { message: "Error deleting" };
    const rejectPromise = Promise.reject(errorMessage);
    productModel.findByIdAndDelete.mockReturnValue(rejectPromise)
    await productController.deleteProduct(req, res, next);
    expect(next).toHaveBeenCalledWith(errorMessage);
  })
})