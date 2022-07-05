function renderPage(req, res) {
    return res.render('ownerRegi', { pre: 'Owner registration', func: () => { return 9912; } });
}


module.exports = {
    renderPage
}