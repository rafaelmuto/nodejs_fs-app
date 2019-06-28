const express = require('express');
const { body } = require('express-validator/check');

const feedController = require('../controllers/feedApiController');
const apiAuth = require('../middlewares/apiAuth');

const router = express.Router();

router.get('/posts', apiAuth, feedController.getPosts);

router.post(
  '/post',
  apiAuth,
  body('title')
    .trim()
    .isLength({ min: 5 }),
  body('content')
    .trim()
    .isLength({ min: 5 }),
  feedController.createPost
);

router.get('/post/:postId', feedController.getPost);

router.put(
  '/post/:postId',
  apiAuth,
  body('title')
    .trim()
    .isLength({ min: 5 }),
  body('content')
    .trim()
    .isLength({ min: 5 }),
  feedController.updatePost
);

router.delete('/post/:postId', apiAuth, feedController.deletePost);

module.exports = router;
