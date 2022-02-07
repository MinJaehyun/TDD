const productModel = require('../models/product');

exports.createProduct = (req, res, next) => {
  // model.Article 이런식으로 사용했다.
  productModel.create(req.body);

  // res.send("test");
  // TypeError: Cannot read properties of undefined (reading 'send')
};
