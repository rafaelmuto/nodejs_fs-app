// node.js core module to construc paths:
const path = require('path');

const rootDir = require('../util/rootPath.js');

const express = require('express');

const products = [];

// creating router obj with express.Router() function, the function returns an obj:
const router = express.Router();

// /admin/add-product => GET
router.get('/add-product', (req, res, nxt) => {
    // res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
    res.render('add-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product'
    });
});

// /admin/add-product => POST
router.post('/add-product', (req, res, nxt) => {
    console.log('adding:', req.body);
    products.push({
        title: req.body.title
    });
    res.redirect('/');
});

// exporting the router obj:
module.exports = {
    routes: router,
    products: products
};