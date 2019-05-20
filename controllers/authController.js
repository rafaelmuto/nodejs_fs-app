// importing bcrypt pack:
const bcrypt = require("bcryptjs");

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
  const email = req.body.email;
  const password = req.body.password;
  userModel
    .findOne({ email: email })
    .then(user => {
      if (user !== null) {
        bcrypt
          .compare(password, user.password)
          .then(match => {
            if (match) {
              req.session.isLoggedIn = true;
              req.session.user = user;
              req.session.save(err => {
                console.log("-> registering req.session.user:", user);
                res.redirect("/");
              });
            } else {
              res.redirect("/login");
            }
          })
          .catch(err => {
            console.log(err);
            res.redirect("/login");
          });
      } else {
        req.session.isLoggedIn = false;
        req.session.user = null;
        console.log(" registering req.session.user: fail");
        res.redirect("/");
      }
    })
    .catch(err => {
      console.log(err);
    });
};

exports.postLogout = (req, res, nxt) => {
  console.log("==> authController: postLogout");
  req.session.destroy(err => {
    console.log("->", err);
    res.redirect("/");
  });
};

exports.getSignup = (req, res, nxt) => {
  console.log("==> authController: getSignup");
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Sign-Up",
    isAuth: req.session.isLoggedIn
  });
};

exports.postSignup = (req, res, nxt) => {
  console.log("==> authController: postSignup");
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  userModel
    .findOne({ email: email })
    .then(user => {
      if (user) {
        console.log("-> email already exists");
        return res.redirect("/signup");
      }
      if (password !== confirmPassword) {
        console.log("-> passwords don't match");
        return res.redirect("/signup");
      }

      return bcrypt
        .hash(password, 12)
        .then(hashedPassword => {
          const newUser = new userModel({
            email: email,
            password: hashedPassword,
            cart: { items: [] }
          });
          return newUser.save();
        })
        .then(result => {
          res.redirect("/login");
        });
    })
    .catch(err => {
      console.log(err);
    });
};
