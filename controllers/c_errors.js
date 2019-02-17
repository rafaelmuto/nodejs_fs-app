exports.err404 = (req, res, nxt) => {
    res.status(404).render('404', {
        pageTitle: 'Err404 Page Not Found'
    });
};