// importing Product model:
const productModel = require('../models/productModel');

// here we exports all admin routes functions:

// you can use module.exports or just exports...
module.exports.getAddProduct = (req, res, nxt) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        // pug doesnt care about having or not the edit: false here:
        edit: false
    });
};

exports.postAddProduct = (req, res, nxt) => {
    console.log('>>>adding:', req.body);
    const product = new productModel(null, req.body.title, req.body.imageURL, req.body.description, req.body.price);
    product.save();
    res.redirect('/');
};

exports.getEditProduct = (req, res, nxt) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/');
    }
    const prodId = req.params.productId;
    productModel.findById(prodId, (product) => {
        if (!product) {
            res.redirect('/');
        }
        res.render('admin/edit-product', {
            pageTitle: 'Edit Product',
            path: '/edit-product',
            edit: editMode,
            product: product
        });
    });
};

exports.postEditProduct = (req, res, nxt) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageURL = req.body.imageURL;
    const updatedDescription = req.body.description;
    const updatedProduct = new productModel(prodId, updatedTitle, updatedImageURL, updatedDescription, updatedPrice);
    updatedProduct.save();
    console.log(updatedProduct);
    res.redirect('/admin/products');
};

exports.getAdminProducts = (req, res, nxt) => {
    productModel.fetchAll((products) => {
        res.render('admin/products-list', {
            pageTitle: 'Admin Products',
            path: '/admin/products',
            products: products
        });
    });
};

exports.postDeleteProduct = (req, res, nxt) => {
    const prodId = req.body.productId;
    productModel.deleteById(prodId);
    res.redirect('/admin/products');
};