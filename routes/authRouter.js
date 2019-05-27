const express = require("express");

const authController = require("../controllers/authController");

// creating router obj with express.Router() function, the function returns an obj:
const router = express.Router();

// GET route for login page
router.get("/login", authController.getLogin);

// POST route to deal with data from the login page
router.post("/login", authController.postLogin);

// POST route to logout
router.post("/logout", authController.postLogout);

// GET route for signup
router.get("/signup", authController.getSignup);

// POST route to process the signup info
router.post("/signup", authController.postSignup);

// GET route for reset password
router.get("/reset", authController.getReset);

// POST route for reset password
router.post("/reset", authController.postReset);

// GET route for new-password email link
router.get("/reset/:token", authController.getNewPassword);

// POST route for new-password
router.post("/new-password", authController.postNewPassword);

module.exports = router;
