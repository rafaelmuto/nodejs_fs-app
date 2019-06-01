console.log("==> starting app.js");

// importing credencials & settings:
const SETUP = require("./setup");

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
// importin errorController:
const errorController = require("./controllers/errorController");

// importing userModel:
const userModel = require("./models/userModel");

// creating the server(?) obj with the express():
const app = express();
// creating  new connect-mongodb-session:
const store = new MongoDBStore({
  uri: SETUP.MONGODB_URI,
  collection: "sessions"
});
// initialising CSRF protection (csurf):
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
  console.log("-> req.session.user:", req.session.user._id);
  if (req.session.user) {
    userModel
      .findById(req.session.user)
      .then(user => {
        req.user = user;
        console.log("-> req.user._id:", req.user._id);
        nxt();
      })
      .catch(err => {
        throw new Error(err);
      });
  } else {
    console.log("-> no user...");
    req.user = null;
    nxt();
  }
});

// setting local variables to all redered views:
app.use((req, res, nxt) => {
  res.locals.isAuth = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  nxt();
});

// registering routes as middlewares:
app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get("/500", errorController.get500);

// catch all route for 404 errors:
app.use(errorController.get404);

app.use((err, req, res, nxt) => {
  res.redirect("/500");
});

// ==> Connecting to the database and Starting app.server:
mongoose
  .connect(
    SETUP.MONGODB_URI,
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
  .catch(err => console.log(err));
