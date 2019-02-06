// node.js core module to construc paths:
const path = require('path');

const express = require('express');

// creating router obj with express.Router() function, the function returns an obj:
const router = express.Router();

router.get('/add-product', (req, res, nxt) => {
    res.sendFile(path.join(__dirname, '../', 'views', 'add-product.html'));
});

router.post('/add-product', (req, res, nxt) => {
    console.log(req.body);
    res.redirect('/');
});

// exporting the router obj:
module.exports = router;
``