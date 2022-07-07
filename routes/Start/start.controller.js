function renderPage(req, res) {
    return res.render('home', {
        pre: 'Shit!!',
        title: 'Cool, huh!',
        name: "rakib",
        condition: true,
        anyArray: [1, 2, 3],
    });
}

module.exports = {
    renderPage
}