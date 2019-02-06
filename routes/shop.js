// core module to construct paths in node.js:
const path = require('path');

const express = require('express');

// create a router obj:
const router = express.Router();

router.get('/', (req, res, nxt) => {
    res.sendFile(path.join(__dirname, '../', 'views', 'shop.html'));
});

// export router obj:
module.exports = router;