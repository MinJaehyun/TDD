const productController = require('../../controller/products');
const productModel = require('../../models/product');
const httpMocks = require('node-mocks-http');
const newProduct = require('../data/new-product.json');
const allProducts = require('../data/all-products.json');

productModel.create = jest.fn();
productModel.find = jest.fn();
productModel.findById = jest.fn();
productModel.findByIdAndUpdate = jest.fn();

const productId = "6201ef110260a022ede7d155"

let req, res, next;
beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = jest.fn();
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
  it("should return 201 response code", async () => {
    await productController.createProduct(req, res, next);
    expect(res.statusCode).toBe(201);
    expect(res._isEndCalled()).toBeTruthy();
  })
  // 응답 값 반환: json => send 로 test 해보기 TODO:node-mocks-http
  it("should return json body in response", async () => {
    productModel.create.mockReturnValue(newProduct);
    await productController.createProduct(req, res, next);
    expect(res._getJSONData()).toStrictEqual(newProduct);
  })
  // 에러 처리 구현
  it("should handle errors", async () => {
    /** 
     * 1. 메시지 작성
     * 2. 비동기 요청에 대한 결과 값을, 성공 또는 실패로 만든다.
     * 3. 모델을 생성 시 실패한 결과 값을 나타낸다
     * 4. 기댓값에 next 로 설정하고, 인자로 무엇이 넘어왔었는지를 검증한다.
     * 5. 실제 코드를 작성한다.
    */
    const errorMessage = { message: "description property missing" };
    const rejectedPromise = Promise.reject(errorMessage);
    productModel.create.mockReturnValue(rejectedPromise);
    await productController.createProduct(req, res, next);
    expect(next).toBeCalledWith(errorMessage);
    // err: TypeError: next is not a function
    // next 를 함수로 만들어 주는데, 기존에 내용을 참고하지 않고 가짜 함수로 만든다
    // 해결: 상단 next: null 값 변경 => jest.fn();
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
    // allProducts.find 하면 리턴값은 가짜값인 allProducts 를 출력한다
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
    // return 할 data 는 mock 데이터 이여야 한다. 고로, mockReturnValue 를 사용하여 임시 데이터를 넣는다.
    productModel.findById.mockReturnValue(newProduct);
    await productController.getProductById(req, res, next);
    // 상태코드, _getJSONData: 전달한 JSON 타입의 결과값을 참조할 수 있다, json or send 응답 
    expect(res.statusCode).toBe(200);
    // _getJSONData 는 newProduct 와 같다
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
    req.body = { name: "update", description: "update" };
    await productController.updateProduct(req, res, next);
    expect(productModel.findByIdAndUpdate).toHaveBeenCalledWith(
      productId, { name: "update", description: "update" }, { new: true }
    )
  })
})