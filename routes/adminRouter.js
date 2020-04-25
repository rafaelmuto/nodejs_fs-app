const express = require('express');

// importing express-validator:
const { body } = require('express-validator/check');

// creating router obj with express.Router() function, the function returns an obj:
const router = express.Router();

// importing controllers:
const adminController = require('../controllers/adminController');

// importing isAuth middleware:
const isAuth = require('../middlewares/isAuth');

// GET route to display the list of products of a user:
router.get('/products', isAuth, adminController.getAdminProducts);

// GET route to display the add-product form:
router.get('/add-product', isAuth, adminController.getAddProduct);

// POST route to include a product to the database:
router.post(
  '/add-product',
  isAuth,
  body('title')
    .isString()
    .isLength({
      min: 3,
    })
    .trim(),
  body('price').isFloat(),
  body('description').isLength({
    min: 5,
    max: 255,
  }),
  adminController.postAddProduct
);

// GET route to display the edit-product form pre populated with data about that product:
router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

// POST route to edit a product in the database:
router.post(
  '/edit-product',
  isAuth,
  body('title')
    .isString()
    .isLength({
      min: 3,
    })
    .trim(),
  body('price').isFloat(),
  body('description').isLength({
    min: 5,
    max: 255,
  }),
  adminController.postEditProduct
);

// POST route to delete a product:
router.delete('/deproduct/:productId', isAuth, adminController.deleteProduct);

// exporting the router obj:
module.exports = router;
