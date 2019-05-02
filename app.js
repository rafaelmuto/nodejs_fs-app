// importing express.js and other modules:
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

// importing routes:
const adminRoutes = require("./routes/adminRouter");
const shopRoutes = require("./routes/shopRouter");

// importing models:
const userModel = require("./models/userModel");

const mongoConnect = require("./util/database.js").mongoConnect;

// creating the server(?) obj with the express() function, the function returns an obj:
const app = express();

// =================
// Middlewares:
// =================

// setting up the view engine (pug):
app.set("view engine", "pug");
// setting up the views folder, /views is the default thouth:
app.set("views", "views");

// register the new middleware; bodyParser (imported previously):
app.use(bodyParser.urlencoded({ extended: false }));

// middleware for serving static files:
app.use(express.static(path.join(__dirname, "public")));

// registering user in the req:
app.use((req, res, nxt) => {
  userModel
    .findById("5cca00e2539d3e2af63635f6")
    .then(user => {
      req.user = new userModel(user.username, user.email, user.cart, user._id);
      nxt();
    })
    .catch(err => {
      console.log(err);
    });
});

// registering imported routers as middlewares:
app.use("/admin", adminRoutes);
app.use(shopRoutes);

// catch all route for 404 errors:
// instead of creating a whole controller you can just put your route here...
app.use((req, res, nxt) => {
  res.status(404).render("404", { pageTitle: "Err404 Page Not Found" });
});

// ====================
// Starting app.server:
// ====================

mongoConnect(() => {
  app.listen(3000);
});
