const express = require('express');
const router = express.Router();
const productController = require('./controller/products.js');

router.get('/', productController.createProduct)

module.exports = router;