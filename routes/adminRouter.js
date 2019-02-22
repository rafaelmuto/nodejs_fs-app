const express = require('express');

// creating router obj with express.Router() function, the function returns an obj:
const router = express.Router();

// importing controllers:
const adminController = require('../controllers/adminController');

router.get('/products', adminController.getAdminProducts);

// /admin/add-product -> GET
router.get('/add-product', adminController.getAddProduct);
// /admin/add-product -> POST
router.post('/add-product', adminController.postAddProduct);
// admin/edit-product -> GET
router.get('/edit-product/:productId', adminController.getEditProduct);
// admin/edit-product -> POST
router.post('/edit-product', adminController.postEditProduct);

// exporting the router obj:
module.exports = router;