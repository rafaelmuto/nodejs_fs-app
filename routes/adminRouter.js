const express = require("express");

// creating router obj with express.Router() function, the function returns an obj:
const router = express.Router();

// importing controllers:
const adminController = require("../controllers/adminController");

// // GET route to display the list of products of a user:
// router.get("/products", adminController.getAdminProducts);

// GET route to display the add-product form:
router.get("/add-product", adminController.getAddProduct);

// POST route to include a product to the database:
router.post("/add-product", adminController.postAddProduct);

// // GET route to display the edit-product form pre populated with data about that product:
// router.get("/edit-product/:productId", adminController.getEditProduct);

// // POST route to edit a product in the database:
// router.post("/edit-product", adminController.postEditProduct);

// // POST route to delete a product:
// router.post("/delete-product", adminController.postDeleteProduct);

// exporting the router obj:
module.exports = router;
