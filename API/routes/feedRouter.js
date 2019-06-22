const express = require('express');

const feedController = require('../API/controllers/feedController');

const router = express.Router('/posts', feedController.getPosts);

module.exports = router;
