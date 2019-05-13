const express = require("express");

const authController = require("../controllers/authController");

// creating router obj with express.Router() function, the function returns an obj:
const router = express.Router();

// GET route for login page
router.get("/login", authController.getLogin);

// POST route to deal with data from the login page
router.post("/login", authController.postLogin);

module.exports = router;
