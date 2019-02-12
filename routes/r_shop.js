// core module to construct paths in node.js:
const path = require('path');


const rootDir = require('../util/rootPath.js');
const adminData = require('./r_admin.js');


const express = require('express');

// create a router obj:
const router = express.Router();

router.get('/', (req, res, nxt) => {

    // res.sendFile(path.join(rootDir, 'views', 'shop.html'));
    const products = adminData.products;

    res.render('shop', {
        pageTitle: 'Shop',
        path: '/',
        prods: products
    });

    console.log('>>>r_shop.js', adminData.products);
});

// export router obj:
module.exports = router;