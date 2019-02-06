const express = require('express');

// create a router obj:
const router = express.Router();

router.get('/', (req, res, nxt) => {
    console.log('hello world route reached!');
    res.send('<h1> Hello World! </h1>');
});

// export router obj:
module.exports = router;