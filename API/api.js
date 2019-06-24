console.log('==> starting api.js');

// importing modules:
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// importing resources:
const SETUP = require('../setup');
const feedRouter = require('./routes/feedRouter');

// initilzing express.js:
const app = express();

// ==> middlewares:

// initializing body-parser for json parse:
// application/json
app.use(bodyParser.json());

// middleware to allow CORS (Cross-Origin Resource Sharing):
app.use((req, res, nxt) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  nxt();
});

app.use('/feed', feedRouter);
// error route middleware:
app.use((err, req, res, nxt) => {
  console.log(err);
  const status = err.statusCode || 500;
  const message = err.message;
  res.status(status).json({ message: message });
});

mongoose
  .connect(SETUP.MONGODB_URI_API, { useNewUrlParser: true })
  .then(res => {
    console.log('-> Mongoose Connection OK!');
    console.log('... starting server on port 8080');
    app.listen(SETUP.API_SERVER_PORT);
  })
  .catch(err => console.log(err));
