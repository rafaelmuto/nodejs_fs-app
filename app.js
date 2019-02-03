console.log('app.js running on node.js');

//importing http and file system packege
const http = require('http');
const fs = require('fs');

//creating the http object
const server = http.createServer((req, res) => {
    console.log(req.url, req.method, req.headers);
    res.write('hello world');
    res.end();
});

//starting serves listeing at port 3000...
server.listen(3000);