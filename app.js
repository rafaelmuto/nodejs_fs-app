console.log('==> starting app.js');

// ==> importing express.js and other modules:
const express = require('express');
const path = require('path');
// -> body-parser: parsing body data into req.body
const bodyParser = require('body-parser');
// -> mongoose: Mongoose is a MongoDB object modeling tool designed to work in an
//    asynchronous environment.
const mongoose = require('mongoose');
// -> express-session: storing session data in the server-side.
const session = require('express-session');
// -> connect-mongodb-session: This module exports a single function which takes an
//    instance of connect (or Express) and returns a MongoDBStore class that can be
//    used to store sessions in MongoDB.
const MongoDBStore = require('connect-mongodb-session')(session);
// -> CSURF: cross-site request forgery protection
const csrf = require('csurf');
// -> connect-flash: used in combination with redirects, ensuring that the message
//    is available to the next page that is to be rendered.
const flash = require('connect-flash');
// -> Multer: middleware for handling `multipart/form-data`, which is primarily used for uploading files.
const multer = require('multer');
// -> Helmet: Helmet helps you secure your Express apps by setting various HTTP headers. It’s not a silver bullet, but it can help!
const helmet = require('helmet');
// -> Compression: Node.js compression middleware.
const compression = require('compression');

// importing routes:
const adminRoutes = require('./routes/adminRouter');
const shopRoutes = require('./routes/shopRouter');
const authRoutes = require('./routes/authRouter');
// importin constrollers:
const errorController = require('./controllers/errorController');
const shopController = require('./controllers/shopController');
// importing isAuth middleware:
const isAuth = require('./middlewares/isAuth');
// importing userModel:
const userModel = require('./models/userModel');

// creating the server obj with the express():
const app = express();
// creating  new connect-mongodb-session:
const store = new MongoDBStore({
  uri: process.env.MONGODB_URI,
  collection: 'sessions'
});
// initialising CSRF protection (csurf):
const csrfProtection = csrf();

// config multer storage and fileFilter:
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + '_' + file.originalname);
  }
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// ==> Middlewares:

// setting up the view engine (pug):
app.set('view engine', 'pug');
// setting up the views folder, /views is the default thouth:
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'));

app.use(helmet());
app.use(compression());

// serving static files:
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(
  session({
    secret: 'secret_word_here',
    resave: false,
    saveUninitialized: false,
    store: store
  })
);

app.use(flash());

// this middleware registers the userModel obj to the req:
app.use((req, res, nxt) => {
  console.log('::: server request :::');
  console.log('=> Registering User');
  if (req.session.user) {
    console.log(' -> req.session.user._id:', req.session.user._id);
    userModel
      .findById(req.session.user)
      .then(user => {
        req.user = user;
        console.log(' -> req.user', req.user);
        nxt();
      })
      .catch(err => nxt(new Error(err)));
  } else {
    console.log(' -> no user...');
    req.user = null;
    nxt();
  }
});

// POST route for creating an order from the current user cart:
app.post('/create-order', isAuth, shopController.postOrder);

// == IMPORTANT: adding csrf here only protects routes bellow ==
app.use(csrfProtection);
// setting local variables to all redered views:
app.use((req, res, nxt) => {
  console.log(' -> res.locals.isAuth: ', req.session.isLoggedIn);
  res.locals.isAuth = req.session.isLoggedIn;
  let token = req.csrfToken();
  console.log(' -> res.locals.csrfToken: ', token);
  res.locals.csrfToken = token;
  nxt();
});

// registering route middlewares:
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

// catch all route for 404 errors:
app.use(errorController.get404);
// error catch:
app.use(errorController.get500);

// ==> Connecting to the database and Starting app.server:
mongoose
  .connect(
    process.env.MONGODB_URI,
    // warning: (node:70332) DeprecationWarning: current URL string parser is deprecated,
    // and will be removed in a future version. To use the new parser, pass option
    // { useNewUrlParser: true } to MongoClient.connect.
    { useNewUrlParser: true }
  )
  .then(result => {
    console.log('=> mongoose connected!');
    console.log(' -> starting server listen @ port:', process.env.PORT || 3000);
    app.listen(process.env.PORT || 3000);
  })
  .catch(err => console.log(err));
