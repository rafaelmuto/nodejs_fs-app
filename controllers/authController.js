// importing bcrypt pack:
const bcrypt = require("bcryptjs");
// importing nodemailer and nodemailer-sendgrid-transport:
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");

const userModel = require("../models/userModel");

// initialising nodemailer
const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key:
        "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"
    }
  })
);

exports.getLogin = (req, res, nxt) => {
  console.log("==> authController: getLogin");
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    errorMessage: message
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
              req.flash("error", "Password invalid...");
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
        req.flash("error", "Invalid email...");
        res.redirect("/login");
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
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Sign-Up",
    isAuth: req.session.isLoggedIn,
    errorMessage: message
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
        req.flash("error", "this e-mail already exists!");
        return res.redirect("/signup");
      }
      if (password !== confirmPassword) {
        console.log("-> passwords don't match");
        req.flash("error", "passwords don`t match!");
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
          console.log("-> signup successfull, sending email...");
          res.redirect("/login");
          return transporter.sendMail({
            to: email,
            from: "nodejs_app@nodejs.app",
            subject: "Sign up succeeded!",
            html: "<h1>  You successfully signed up! </h1>"
          });
        })
        .catch(err => {
          console.log(err);
        });
    })
    .catch(err => {
      console.log(err);
    });
};
