console.log('app.js running on node.js');

//importing http and file system core modules
const http = require('http');
const fs = require('fs');

const routes = require('./routes.js');

//creating the http object
const server = http.createServer(routes);

//starting serves listeing at port 3000...
server.listen(3000);