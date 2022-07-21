function renderPage(req, res) {
    return res.render('regi', {
        layout: 'layout2',
        pre: 'Registration',
        type: req.params['userType'],
        cndtn: req.params['userType'] === 'owner',
    });
}

function registerUser(req, res) {
    // a procedure to add in user, then owner table : returns owner id;
    // for error returns errorCode;
    res.send(req.body);
}

module.exports = {
    renderPage, registerUser,
}