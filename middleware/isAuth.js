// middleware to check if user is loggedin

module.exports = (req, res, nxt) => {
  if (!req.session.isLoggedIn) {
    return res.redirect("/login");
  }
  nxt();
};
