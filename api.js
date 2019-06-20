console.log('==> starting api.js');

const express = require('express');
const bodyParser = require('body-parser');

const feedRouter = require('./routes/feedRouter');

const app = express();

app.use('/feed', feedRouter);

app.listen(8080);
