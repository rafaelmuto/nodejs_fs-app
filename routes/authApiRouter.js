const express = require('express');
const { body } = require('express-validator');

const authApiController = require('../controllers/authApiController');
const userModel = require('../models/userApiModel');
const apiAuth = require('../middlewares/apiAuth');

const router = express.Router();

router.put(
  '/signup',
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email.')
    .custom((value, { req }) => {
      return userModel.findOne({ email: value }).then(user => {
        if (user) {
          return Promise.reject('email address already exists!');
        }
      });
    }),
  body('password')
    .trim()
    .isLength({ min: 5 }),
  body('name')
    .trim()
    .not()
    .isEmpty(),
  authController.signup
);

router.post('/login', authApiController.login);

router.get('/status', apiAuth, authApiController.getStatus);

router.patch(
  '/status',
  apiAuth,
  body('status')
    .trim()
    .not()
    .isEmpty(),
  authController.updateStatus
);

module.exports = router;
