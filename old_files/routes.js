const requestHandler = (req, res) => {
    console.log(req.url, req.method);
    const url = req.url;
    const method = req.method;

    // routes goes here:
    if (url === '/' && method === 'GET') {
        res.write('Hello World!');
        return res.end();
    }

    if (url === '/test' && method === 'GET') {
        res.write('this is a test route');
        return res.end();
    }

    // this route is only reached when none other worked...
    res.statusCode = 404;
    res.write('404 error');
    res.end();
};

module.exports = requestHandler;

// would function without module. as node.js shortcut:
// exports = requestHandler;

// we can export multiple objects with:
// module.exports = {
//     handler: requestHandler,
//     someText: 'hard coded text 
// };
// or even:
// exports.handler = requestHandler;
// exports.someText = 'some random text';
// and call then as object.handler or object.someText when importing