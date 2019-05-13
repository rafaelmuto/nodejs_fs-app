const userModel = require("../models/userModel");

exports.getLogin = (req, res, nxt) => {
  console.log("==> authController: getLogin");
  res.render("auth/login", { path: "/login", pageTitle: "Login" });
};

exports.postLogin = (req, res, nxt) => {
  console.log("==> authController: postLogin");
  res.setHeader("Set=Cookie");
  req.isLoggedIn = true;
  res.redirect("/");
};

exports.postLogin = (req, res, nxt) => {
  req.session.isLoggedIn = true;
  res.redirect("/");
};
