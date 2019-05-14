const userModel = require("../models/userModel");

exports.getLogin = (req, res, nxt) => {
  console.log("==> authController: getLogin");
  res.render("auth/login", { path: "/login", pageTitle: "Login" });
};

exports.postLogin = (req, res, nxt) => {
  console.log("==> authController: postLogin");
  req.session.isLoggedIn = true;
  res.redirect("/");
};
