const userModel = require("../models/userModel");

exports.getLogin = (req, res, nxt) => {
  console.log("==> authController: getLogin");
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuth: req.session.isLoggedIn
  });
};

exports.postLogin = (req, res, nxt) => {
  console.log("==> authController: postLogin");
  userModel
    .findOne({ email: req.body.email })
    .then(user => {
      if (user !== null) {
        req.session.isLoggedIn = true;
        req.session.user = user;
        req.session.save(err => {
          console.log("-> registering req.session.user:", user);
          res.redirect("/");
        });
      } else {
        req.session.isLoggedIn = false;
        req.session.user = null;
        console.log(" registering req.session.user:", null);
        res.redirect("/");
      }
    })
    .catch(err => {
      console.log(err);
    });
};

exports.postLogout = (req, res, nxt) => {
  console.log("===> authController: postLogout");
  req.session.destroy(err => {
    console.log("->", err);
    res.redirect("/");
  });
};
