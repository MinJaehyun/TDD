const productModel = require('../models/product');
const mongoose = require('mongoose');

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
  try {
    const allProducts = await productModel.find({})
    return res.status(200).json(allProducts);
  } catch (error) {
    next(error)
  }
};

exports.getProductById = async (req, res, next) => {
  try {
    const product = await productModel.findById(req.params.productId);
    if (!product) return res.status(404).send();
    if (!mongoose.isValidObjectId(req.params.productId)) return res.status(404).send({ err: "articleId is invalid" });
    return res.status(200).json(product);
  } catch (error) {
    next(error)
  }
};

exports.updateProduct = async (req, res, next) => {
  const { productId } = req.params;
  await productModel.findByIdAndUpdate(
    productId,
    req.body,
    { new: true }
  )
};