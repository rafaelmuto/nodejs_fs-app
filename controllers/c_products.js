// importing Product model:
const mProduct = require('../models/m_product');

// here we exports all routes functions:

// you can use module.exports or just exports...
module.exports.getAddProduct = (req, res, nxt) => {
    res.render('add-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product'
    });
};

exports.postAddProduct = (req, res, nxt) => {
    console.log('adding:', req.body);
    const product = new mProduct(req.body.title);
    product.save();
    res.redirect('/');
};

exports.getProducts = (req, res, nxt) => {
    mProduct.fetchAll((products) => {
        res.render('shop', {
            pageTitle: 'Shop',
            path: '/',
            products: products
        });
    });
};