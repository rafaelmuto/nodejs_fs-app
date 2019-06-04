// middleware to check if user is loggedin

module.exports = (req, res, nxt) => {
  console.log('=> isAuth');
  if (!req.session.isLoggedIn) {
    console.log('-> not logged...');
    return res.redirect('/login');
  }
  console.log('-> ok!');
  nxt();
};
