const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// =================
// MIDDLEWARES HERE:
// =================

// register the new middleware, bodyParser imported previously:
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use('/form', (req, res, nxt) => {
    res.send('<form action="/form-handler" method="POST"><input type="text" name="message"><button type="submit">submit</button></form>');
});

app.use('/form-handler', (req, res, nxt) => {
    console.log(req.body);
    res.redirect('/form');
});

app.use('/', (req, res, nxt) => {
    console.log('hello world route reached!');
    res.send('<h1> Hello World! </h1>');
});


// starting the server at port 3000:
app.listen(3000);
console.log('>>>starting node server app!');