// importing Product model:
const mProduct = require('../models/m_product');

// here we exports all shop routes functions:

exports.getIndex = (req, res, nxt) => {
    mProduct.fetchAll((products) => {
        res.render('shop/index', {
            pageTitle: 'Shop',
            path: '/',
            products: products
        });
    });
};

exports.getProducts = (req, res, nxt) => {
    mProduct.fetchAll((products) => {
        res.render('shop/product-list', {
            pageTitle: 'Shop',
            path: '/products',
            products: products
        });
    });
};

exports.getCart = (req, res, nxt) => {
    res.render('shop/cart', {
        pageTitle: 'Your Cart',
        path: '/cart'
    });
};

exports.getCheckout = (req, res, nxt) => {
    res.render('shop/checkout', {
        pageTitle: 'Checkout',
        path: '/checkout'
    });
}