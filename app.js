const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const rootDir = require('./util/rootPath.js');

// importing routes:
const adminData = require('./routes/r_admin.js');
const shopRoutes = require('./routes/r_shop.js');

// creating the server(?) obj with the express() function, the function returns an obj:
const app = express();

// setting up the view engine (pug):
app.set('view engine', 'pug');
// setting up the views folder, /views is the default thouth:
app.set('views', 'views');


// =================
// MIDDLEWARES HERE:
// =================

// register the new middleware; bodyParser (imported previously):
app.use(bodyParser.urlencoded({
    extended: false
}));

// middleware for serving static filess
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminData.routes);
app.use(shopRoutes);

app.use((req, res, nxt) => {
    // res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
    res.status(404).render('404');
});

// starting the server at port 3000:
app.listen(3000);
console.log('>>>starting node server app!');
console.log(__dirname);