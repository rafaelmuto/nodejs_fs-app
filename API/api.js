console.log('==> starting api.js');

// importing modules:
const express = require('express');
const bodyParser = require('body-parser');

// importing resources:
const feedRouter = require('../routes/feedRouter');

// initilzing express.js:
const app = express();

// ==> middlewares:

// initializing body-parser for json parse:
// application/json
app.use(bodyParser.json());

app.use('/feed', feedRouter);

app.get((req, res, nxt) => {
  res.json({ teste: 'dummy' });
});

app.listen(8080);
