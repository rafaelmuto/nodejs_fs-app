const express = require('express');

// importing express-validator:
const { check, body } = require('express-validator/check');
// importing authController:
const authController = require('../controllers/authController');
// importing userModel:
const userModel = require('../models/userModel');

// creating router obj with express.Router() function, the function returns an obj:
const router = express.Router();

// GET route for login page
router.get('/login', authController.getLogin);

// POST route to deal with data from the login page using validators
router.post(
  '/login',
  body('email')
    .isEmail()
    .withMessage('Please enter a valid e-mail address')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 5 })
    .withMessage('Please enter a valid password with at least 5 characters')
    .isAlphanumeric()
    .withMessage('Please enter a valid password with only numbers and letters')
    .trim(),
  authController.postLogin
);

// POST route to logout
router.post('/logout', authController.postLogout);

// GET route for signup
router.get('/signup', authController.getSignup);

// POST route to process the signup info using validators
router.post(
  '/signup',
  check('email')
    .isEmail()
    .withMessage('Please enter a valid e-mail')
    .custom((value, { req }) => {
      return userModel.findOne({ email: value }).then((userDoc) => {
        if (userDoc) {
          return Promise.reject('This e-mail is already registered!');
        }
      });
    })
    .normalizeEmail(),
  body('password')
    .isLength({ min: 5 })
    .withMessage('Please enter a valid password with at least 5 characters')
    .isAlphanumeric()
    .withMessage('Please enter a valid password with only numbers and letters')
    .trim(),
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords don`t match');
      }
      return true;
    })
    .trim(),
  authController.postSignup
);

// GET route for reset password
router.get('/reset', authController.getReset);

// POST route for reset password
router.post('/reset', authController.postReset);

// GET route for new-password email link
router.get('/reset/:token', authController.getNewPassword);

// POST route for new-password
router.post('/new-password', authController.postNewPassword);

module.exports = router;
