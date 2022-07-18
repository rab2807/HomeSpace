function renderPage(req, res) {
    return res.render('regi', {
        layout: 'layout2',
        pre: 'Registration',
        type: req.params['userType'],
        cndtn: req.params['userType'] === 'owner',
    });
}

function registerUser(req, res) {
    // check for errors, if no error found save in database and go to profile
    // if error found reload the page


    res.send(req.body);
}

module.exports = {
    renderPage, registerUser,
}