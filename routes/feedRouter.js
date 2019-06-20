const express = require('express');

const feedController = require('../controllers/feedController');

const router = express.Router('/posts', feedController.getPosts);

module.exports = router;
