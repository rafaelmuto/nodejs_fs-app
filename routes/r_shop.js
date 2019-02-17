// core module to construct paths in node.js:
const path = require('path');

const express = require('express');

// creating router obj with express.Router() function, the function returns an obj:
const router = express.Router();

// importing controllers:
const productsController = require('../controllers/c_products.js');

router.get('/', productsController.getProducts);

// export router obj:
module.exports = router;