console.log("==> starting app.js");

// importing credencials & settings:
const SETUP = require("./setup");

const MONGODB_URI = SETUP.MONGODB_URI;

// importing express.js and other modules:
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");

// importing routes:
const adminRoutes = require("./routes/adminRouter");
const shopRoutes = require("./routes/shopRouter");
const authRoutes = require("./routes/authRouter");

// importing userModel:
const userModel = require("./models/userModel");

// creating the server(?) obj with the express() function, the function returns an obj:
const app = express();
// creating  new connect-mongodb-session:
const store = new MongoDBStore({ uri: MONGODB_URI, collection: "sessions" });
// initialising CSRF protection (csruf):
const csrfProtection = csrf();

// ==> Middlewares:

// setting up the view engine (pug):
app.set("view engine", "pug");
// setting up the views folder, /views is the default thouth:
app.set("views", "views");

// register the new middleware; bodyParser:
app.use(bodyParser.urlencoded({ extended: false }));

// middleware for serving static files:
app.use(express.static(path.join(__dirname, "public")));

// registering express-session middleware:
app.use(
  session({
    secret: SETUP.EXPSESS_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store
  })
);

// registering csurf middleware:
app.use(csrfProtection);

// registering connect-flash:
app.use(flash());

// this middleware registers the userModel obj to the req:
app.use((req, res, nxt) => {
  console.log("==> app: Registering User (req.user)");
  console.log("-> logged as:", req.session.user);
  if (req.session.user) {
    userModel
      .findById(req.session.user)
      .then(user => {
        req.user = user;
        console.log("-> req.user:", user);
        nxt();
      })
      .catch(err => {
        console.log(err);
      });
  } else {
    nxt();
  }
});

// setting local variables to all redered views:
app.use((req, res, nxt) => {
  res.locals.isAuth = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  nxt();
});

// registering imported routers as middlewares:
app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

// catch all route for 404 errors:
// instead of creating a whole controller you can just put your route here...
app.use((req, res, nxt) => {
  res.status(404).render("404", {
    pageTitle: "Err404 Page Not Found",
    isAuth: req.isLoggedIn
  });
  console.log("-> Err404 Page Not Found");
});

// ==> Connecting to the database and Starting app.server:

mongoose
  .connect(
    MONGODB_URI,
    // warning: (node:70332) DeprecationWarning: current URL string parser is deprecated,
    // and will be removed in a future version. To use the new parser, pass option
    // { useNewUrlParser: true } to MongoClient.connect.
    { useNewUrlParser: true }
  )
  .then(result => {
    console.log("=> mongoose connected!");
    console.log("-> starting server listen @ port:", SETUP.SERVER_PORT);
    app.listen(SETUP.SERVER_PORT);
  })
  .catch(err => {
    console.log(err);
  });
