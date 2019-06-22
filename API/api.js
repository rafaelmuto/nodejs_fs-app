console.log('==> starting api.js');

// importing modules:
const express = require('express');
const bodyParser = require('body-parser');

// importing resources:
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

app.get('/', (req, res, nxt) => {
  res.json({ teste: 'dummy' });
});

app.listen(8080);
