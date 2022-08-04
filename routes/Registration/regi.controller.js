const {db_registration} = require('../../Database/db_registration');

function renderPage(req, res) {
    const type = req.params['userType'];
    if (type === 'owner' || type === 'tenant')
        return res.render('regi', {
            layout: 'layout2',
            pre: 'Registration',
            type: req.params['userType'],
            cndtn: req.params['userType'] === 'owner',
        });
    else return res.status(400).send({
        message: 'This is an error!'
    });
}

async function registerUser(req, res) {
    const response = req.body;
    const error = db_registration(response);
    if (error.message) {
        console.log(error.message);
        res.redirect('/regi/' + (response.category ? 'owner' : 'tenant'));
        return;
    }
    res.redirect('/login');
}

module.exports = {
    renderPage, registerUser,
}