console.log("==> starting app.js");

// importing express.js and other modules:
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");

// importing routes:
const adminRoutes = require("./routes/adminRouter");
const shopRoutes = require("./routes/shopRouter");

// importing userModel:
const userModel = require("./models/userModel");

// creating the server(?) obj with the express() function, the function returns an obj:
const app = express();

// ==> Middlewares:

// setting up the view engine (pug):
app.set("view engine", "pug");
// setting up the views folder, /views is the default thouth:
app.set("views", "views");

// register the new middleware; bodyParser:
app.use(bodyParser.urlencoded({ extended: false }));

// middleware for serving static files:
app.use(express.static(path.join(__dirname, "public")));

// registering user in the req:
app.use((req, res, nxt) => {
  console.log("-> registering user to req.user");
  userModel
    .findById("5cd3775d4ec45c7e99869cb0")
    .then(user => {
      req.user = user;
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

// ==> Connecting to the database and Starting app.server:

mongoose
  .connect(
    "mongodb+srv://nodeApp:12345@mdbtest-enper.gcp.mongodb.net/nodejs_app?retryWrites=true",
    // warning: (node:70332) DeprecationWarning: current URL string parser is deprecated,
    // and will be removed in a future version. To use the new parser, pass option
    // { useNewUrlParser: true } to MongoClient.connect.
    { useNewUrlParser: true }
  )
  .then(result => {
    console.log("==> mongoose connected!");

    userModel.findOne().then(user => {
      if (!user) {
        const user = new userModel({
          name: "rafaelmuto",
          email: "r.nagahama@gmail.com",
          cart: {
            items: []
          }
        });
        console.log("-> creating test user:", user);
        user.save();
      }
    });

    console.log("-> starting server listen");
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });
