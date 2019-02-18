// importing Product model:
const mProduct = require('../models/m_product');

// here we exports all admin routes functions:

// you can use module.exports or just exports...
module.exports.getAddProduct = (req, res, nxt) => {
    res.render('admin/add-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product'
    });
};

exports.postAddProduct = (req, res, nxt) => {
    console.log('adding:', req.body);
    const product = new mProduct(req.body.title, req.body.imageURL, req.body.description, req.body.price);
    product.save();
    res.redirect('/');
};

exports.getAdminProducts = (req, res, nxt) => {
    res.render('admin/products-list', {
        pageTitle: 'Admin Products',
        path: '/admin/products'
    });
};