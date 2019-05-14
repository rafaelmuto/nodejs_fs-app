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
  req.session.isLoggedIn = true;
  res.redirect("/");
};

exports.postLogout = (req, res, nxt) => {
  console.log("===> authController: postLogout");
  req.session.isLoggedIn = false;
  res.redirect("/");
};
