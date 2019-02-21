// importing models:
const mProduct = require('../models/m_product');
const mCart = require('../models/m_cart');

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

exports.getProduct = (req, res, nxt) => {
    const prodId = req.params.productId;
    mProduct.findById(prodId, (product) => {
        res.render('shop/product-detail', {
            pageTitle: product.title,
            path: '/products',
            product: product
        })
    });
};

exports.getCart = (req, res, nxt) => {
    res.render('shop/cart', {
        pageTitle: 'Your Cart',
        path: '/cart'
    });
};

exports.postCart = (req, res, nxt) => {
    const prodId = req.body.productId;
    mProduct.findById(prodId, (product) => {
        mCart.addProduct(prodId, product.price);
    })
    res.redirect('/cart');
};

exports.getCheckout = (req, res, nxt) => {
    res.render('shop/checkout', {
        pageTitle: 'Checkout',
        path: '/checkout'
    });
};

exports.getOrders = (req, res, nxt) => {
    res.render('shop/orders', {
        pageTitle: 'Your Orders',
        path: '/orders'
    })
}