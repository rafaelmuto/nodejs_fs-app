const express = require("express");

// creating router obj with express.Router() function, the function returns an obj:
const router = express.Router();

// importing controllers:
const shopController = require("../controllers/shopController.js");

// importing isAuth middleware:
const isAuth = require("../middlewares/isAuth");

// GET route for the first page:
router.get("/", shopController.getIndex);

// GET route for the products listing:
router.get("/products", shopController.getProducts);

// GET route for getting to the product details page:
router.get("/products/:productId", shopController.getProduct);

// GET route for getting to the cart list:
router.get("/cart", isAuth, shopController.getCart);

// POST route for adding products to the cart:
router.post("/cart", isAuth, shopController.postCart);

// POST route to remove itens from cart:
router.post("/cart-delete-item", isAuth, shopController.postCartDeleteProduct);

// POST route for creating an order from the current user cart:
router.post("/create-order", isAuth, shopController.postOrder);

// GET route to view all orders from the current user:
router.get("/orders", isAuth, shopController.getOrders);

// router.get("/checkout", shopController.getCheckout);

// export router obj:
module.exports = router;
