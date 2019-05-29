// importing bcrypt pack:
const bcrypt = require("bcryptjs");
// importing nodemailer and nodemailer-sendgrid-transport:
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
// importing express-validator:
const { validationResult } = require("express-validator/check");

// importing node.js crypto pack:
const crypto = require("crypto");

// importing credencials and settings:
const SETUP = require("../setup");

const userModel = require("../models/userModel");

// initialising nodemailer
const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: SETUP.SENDGRID_APIKEY
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
    .catch(err => console.log(err));
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
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log("-> validation error!", errors.array());
    return res.status(422).render("auth/signup", {
      path: "/signup",
      pageTitle: "Signup",
      errorMessage: errors.array()[0].msg
    });
  }

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
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
};

exports.getReset = (req, res, nxt) => {
  console.log("==> authController: getReset");
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/reset", {
    path: "/reset",
    pageTitle: "Password Reset",
    isAuth: req.session.isLoggedIn,
    errorMessage: message
  });
};

exports.postReset = (req, res, nxt) => {
  console.log("==> authController: postReset");
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log("-> crypto error...");
      req.flash("error", "error while generating your random link.");
      return res.redirect("/reset");
    }
    const token = buffer.toString("hex");
    userModel
      .findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          console.log("-> user not found");
          req.flash("error", "No account found!");
          return res.redirect("/reset");
        }
        console.log("-> user found:", user.email);
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then(result => {
        console.log("-> sending reset link to:", req.body.email);
        res.redirect("/");
        transporter.sendMail({
          to: req.body.email,
          from: "nodejs_app@nodejs.app",
          subject: "Password Reset",
          html: `
            <p>You Requested a Password Reset</p>
            <p><a href="http://localhost:3000/reset/${token}"> Click here to set a new password</a></p>
          `
        });
      })
      .catch(err => console.log(err));
  });
};

exports.getNewPassword = (req, res, nxt) => {
  console.log("==> authController: getNewPassword");
  const token = req.params.token;
  userModel
    .findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    .then(user => {
      let message = req.flash("error");
      if (message.length > 0) {
        message = message[0];
      } else {
        message = null;
      }
      res.render("auth/new-password", {
        path: "/new-password",
        pageTitle: "New Password",
        isAuth: req.session.isLoggedIn,
        errorMessage: message,
        userId: user._id.toString(),
        passwordToken: token
      });
    })
    .catch(err => console.log(err));
};

exports.postNewPassword = (req, res, nxt) => {
  console.log("==> authController: postNewPassword");
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  let resetUser;

  userModel
    .findOne({
      resetToken: passwordToken,
      resetTokenExpiration: { $gt: Date.now() },
      _id: userId
    })
    .then(user => {
      resetUser = user;
      return bcrypt.hash(newPassword, 12);
    })
    .then(hashedPassword => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then(result => {
      res.redirect("/login");
    })
    .catch(err => console.log(err));
};
