function renderPage(req, res) {
    return res.render('start', {
        pre: 'Welcome',
        layout: 'layout2',
    });
}

module.exports = {
    renderPage
}