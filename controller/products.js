const productModel = require('../models/product');

exports.createProduct = (req, res, next) => {
  // model.Article 이런식으로 사용했다.
  const createProduct = productModel.create(req.body);
  // 아래처럼 사용 가능
  // const info = req.body;     // name, descripttion, price
  // productModel.create(info);

  // res.send("test");
  // TypeError: Cannot read properties of undefined (reading 'send')

  return res.status(201).json(createProduct);
};
