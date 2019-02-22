const express = require('express');

// creating router obj with express.Router() function, the function returns an obj:
const router = express.Router();

// importing controllers:
const adminController = require('../controllers/adminController');

// /admin/add-product => GET
router.get('/add-product', adminController.getAddProduct);
// /admin/add-product => POST
router.post('/add-product', adminController.postAddProduct);
router.get('/products', adminController.getAdminProducts);
router.get('/edit-product/:productId', adminController.getEditProduct);

// exporting the router obj:
module.exports = router;