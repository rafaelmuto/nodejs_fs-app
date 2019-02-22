// importing express.js and other modules:
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

// importing routes:
const adminRoutes = require('./routes/adminRouter');
const shopRoutes = require('./routes/shopRouter');


// creating the server(?) obj with the express() function, the function returns an obj:
const app = express();


// =================
// MIDDLEWARES HERE:
// =================

// setting up the view engine (pug):
app.set('view engine', 'pug');
// setting up the views folder, /views is the default thouth:
app.set('views', 'views');


// register the new middleware; bodyParser (imported previously):
app.use(bodyParser.urlencoded({
    extended: false
}));


// middleware for serving static filess
app.use(express.static(path.join(__dirname, 'public')));


// registering imported routers as midwares:
app.use('/admin', adminRoutes);
app.use(shopRoutes);

// catch all route for 404 errors:
app.use((req, res, nxt) => {
    res.status(404).render('404', {
        pageTitle: 'Err404 Page Not Found'
    });
});


// starting the server at port 3000:
app.listen(3000);
console.log('>>>starting node server app!');
console.log(__dirname);