exports.get404 = (req, res, nxt) => {
  console.log('==> errorController: get404');
  res.status(404).render('404', {
    pageTitle: 'Err404 Page Not Found',
  });
};

exports.get500 = (err, req, res, nxt) => {
  console.log('==> errorController: get500');
  res.status(500).render('500', {
    pageTitle: '500 internal error',
  });
};
