const express = require('express');
const bodyParser = require('body-parser');

// importing routes:
const adminRoutes = require('./routes/admin.js');
const shopRoutes = require('./routes/shop.js');

// creating the server(?) obj with the express() function, the function returns an obj:
const app = express();

// =================
// MIDDLEWARES HERE:
// =================

// register the new middleware; bodyParser (imported previously):
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use((req, res, nxt) => {
    res.status(404).send('<h1>Err404: Page not found!');
});

// starting the server at port 3000:
app.listen(3000);
console.log('>>>starting node server app!');