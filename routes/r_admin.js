// node.js core module to construc paths:
const path = require('path');

const express = require('express');

// creating router obj with express.Router() function, the function returns an obj:
const router = express.Router();

// importing controllers:
const productsController = require('../controllers/c_products.js');

// /admin/add-product => GET
router.get('/add-product', productsController.getAddProduct);

// /admin/add-product => POST
router.post('/add-product', productsController.postAddProduct);

// exporting the router obj:
module.exports = router;