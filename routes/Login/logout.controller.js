function renderPage(req, res) {
    res.cookie('jwt', '', {maxAge: 1});
    return res.redirect('/');
}

module.exports = {
    renderPage
}