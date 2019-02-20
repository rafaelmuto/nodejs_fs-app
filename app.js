const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

// creating the server(?) obj with the express() function, the function returns an obj:
const app = express();


// setting up the view engine (pug):
app.set('view engine', 'pug');
// setting up the views folder, /views is the default thouth:
app.set('views', 'views');


// importing routes:
const adminRoutes = require('./routes/r_admin.js');
const shopRoutes = require('./routes/r_shop.js');

// =================
// MIDDLEWARES HERE:
// =================

// register the new middleware; bodyParser (imported previously):
app.use(bodyParser.urlencoded({
    extended: false
}));

// middleware for serving static filess
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use((req, res, nxt) => {
    res.status(404).render('404', {
        pageTitle: 'Err404 Page Not Found'
    });
});

// starting the server at port 3000:
app.listen(3000);
console.log('>>>starting node server app!');
console.log(__dirname);