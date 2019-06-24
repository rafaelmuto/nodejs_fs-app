const { validationResult } = require('express-validator');
const postModel = require('../models/postModel');

exports.getPosts = (req, res, nxt) => {
  console.log('==> feedController: getPosts');
  postModel
    .find()
    .then(posts => {
      res.status(200).json({ message: 'Fetched posts successfully.', posts: posts });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      nxt(err);
    });
};

exports.createPost = (req, res, nxt) => {
  console.log('==> feedController: createPost');

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error;
  }

  const title = req.body.title;
  const content = req.body.content;

  const post = new postModel({
    title: title,
    content: content,
    imageUrl: 'images/TS11B39KPLP_Zoom_F_1.jpg',
    creator: { name: 'DummyUser' }
  });

  post
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: 'Post created successfully!',
        post: result
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      nxt(err);
    });
};

exports.getPost = (req, res, nxt) => {
  console.log('==> feedController: getPost');
  const postId = req.params.postId;

  postModel
    .findById(postId)
    .then(post => {
      if (!post) {
        const err = new Error('Could not fund post.');
        err.statusCode = 404;
        throw err;
      }
      res.status(200).json({ message: 'Post fetched.', post: post });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      nxt(err);
    });
};
