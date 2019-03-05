// importing express.js and other modules:
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

// importing routes:
const adminRoutes = require('./routes/adminRouter');
const shopRoutes = require('./routes/shopRouter');

// importing the database file:
const sqlize = require('./util/database');
// importing models:
const userModel = require('./models/userModel');
const productModel = require('./models/productModel');


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


// middleware for serving static files:
app.use(express.static(path.join(__dirname, 'public')));


// this middleware looks for a userId == 1 and register the userModel Obj in the req:
app.use((req, res, nxt) => {
    userModel.findByPk(1)
        .then(user => {
            req.user = user;
            nxt();
        })
        .catch(err => console.log(err));
});


// registering imported routers as middlewares:
app.use('/admin', adminRoutes);
app.use(shopRoutes);

// catch all route for 404 errors:
// instead of creating a whole controller you can just put your route here...
app.use((req, res, nxt) => {
    res.status(404).render('404', {
        pageTitle: 'Err404 Page Not Found'
    });
});



// creating models relations:
productModel.belongsTo(userModel, {
    constraints: true,
    onDelete: 'CASCADE'
});
// or you could say:
userModel.hasMany(productModel);



// syncs the database with the models:
sqlize.sync({
        // this option forces changes in the database structure, may not be a good ideia on production... ;)
        // force: true
    })
    // only starts the server if the sync action is ok:
    .then(result => {
        // console.log(result);
        return userModel.findByPk(1);
    })
    .then(user => {
        if (!user) {
            // if findByPk(1) returns empty then create a new dummy user:
            return userModel.create({
                name: 'rafaelmuto',
                email: 'r.nagahama@gmail.com'
            })
        }
        return Promise.resolve(user);
    })
    .then(user => {
        // console.log(user);
        // starting the server at port 3000:
        app.listen(3000);
        console.log('>>>starting node server app!');
        console.log(__dirname);
    })
    .catch(err => console.log(err));