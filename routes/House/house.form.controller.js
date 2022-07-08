function renderPage(req, res) {
    res.render('house-form', {

    });
}

function postForm(req, res) {
    res.send(req.body);
}

module.exports = {
    renderPage, postForm,
}