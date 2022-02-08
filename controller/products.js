const productModel = require('../models/product');

exports.createProduct = async (req, res, next) => {
  try {
    // model.Article 이런식으로 사용했다.
    const createProduct = await productModel.create(req.body);
    // console.log('createProduct', createProduct);
    // 아래처럼 사용 가능
    // const info = req.body;     // name, descripttion, price
    // productModel.create(info);

    // res.send("test");
    // TypeError: Cannot read properties of undefined (reading 'send')
    return res.status(201).json(createProduct);
  } catch (error) {
    next(error);
  }
};

exports.getProducts = async (req, res, next) => {
  const allProducts = await productModel.find({})
  return res.status(200).json(allProducts);
};
