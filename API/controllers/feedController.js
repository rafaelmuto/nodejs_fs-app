const { validationResult } = require('express-validator');
const postModel = require('../models/postModel');
const fs = require('fs');
const path = require('path');

exports.getPosts = (req, res, nxt) => {
  console.log('==> feedController: getPosts');

  const currentPage = req.query.page || 1;
  const perPage = 2;
  let totalItems;

  postModel
    .find()
    .countDocuments()
    .then(count => {
      totalItems = count;
      return postModel
        .find()
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
    })
    .then(posts => {
      res.status(200).json({ message: 'Fetched posts successfully.', posts: posts, totalItems: totalItems });
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
    error.data = errors.array();
    throw error;
  }

  if (!req.file) {
    const error = new Error('No image provided.');
    error.statusCode = 422;
    throw error;
  }

  const title = req.body.title;
  const content = req.body.content;
  const imageUrl = req.file.path;
  const post = new postModel({
    title: title,
    content: content,
    imageUrl: imageUrl,
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

exports.updatePost = (req, res, nxt) => {
  console.log('==> feedController: updatePost');

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  const postId = req.params.postId;
  const title = req.body.title;
  const content = req.body.content;
  let imageUrl = req.body.image;

  if (req.file) {
    imageUrl = req.file.path;
  }
  if (!imageUrl) {
    const error = new Error('No file picked.');
    error.statusCode = 422;
    throw error;
  }

  postModel
    .findById(postId)
    .then(post => {
      if (!post) {
        const err = new Error('Could not fund post.');
        err.statusCode = 404;
        throw err;
      }
      if (imageUrl !== post.imageUrl) {
        clearImage(post.imageUrl);
      }
      post.title = title;
      post.content = content;
      post.imageUrl = imageUrl;
      return post.save();
    })
    .then(result => {
      res.status(200).json({ message: 'Post updated.', post: result });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      nxt(err);
    });
};

exports.deletePost = (req, res, nxt) => {
  console.log('==> feedControler: deletePost');

  const postId = req.params.postId;
  postModel
    .findById(postId)
    .then(post => {
      // cheack login info
      if (!post) {
        const err = new Error('Could not fund post.');
        err.statusCode = 404;
        throw err;
      }
      clearImage(post.imageUrl);
      return postModel.findByIdAndRemove(postId);
    })
    .then(result => {
      console.log(result);
      res.status(200).json({ message: 'deleted post.' });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      nxt(err);
    });
};

const clearImage = filePath => {
  filePath = path.join(__dirname, '..', filePath);
  fs.unlink(filePath, err => console.log(err));
};
