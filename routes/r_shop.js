// core module to construct paths in node.js:
const path = require('path');

const express = require('express');

// creating router obj with express.Router() function, the function returns an obj:
const router = express.Router();

// importing controllers:
const shopController = require('../controllers/c_shop.js');

router.get('/', shopController.getIndex);
router.get('/products', shopController.getProducts);
router.get('/cart', shopController.getCart);
router.get('/checkout', shopController.getCheckout);
router.get('/orders', shopController.getOrders);

// export router obj:
module.exports = router;