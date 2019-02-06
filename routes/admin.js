const express = require('express');

// creating router obj with express.Router() function, the function returns an obj:
const router = express.Router();

router.get('/add-product', (req, res, nxt) => {
    res.send('<form action="/admin/add-product" method="POST"><input type="text" name="title"><button type="submit">submit</button></form>')
});

router.post('/add-product', (req, res, nxt) => {
    console.log(req.body);
    res.redirect('/');
});

// exporting the router obj:
module.exports = router;