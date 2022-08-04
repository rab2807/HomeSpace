const {db_login} = require('../../Database/db_login');
const {createToken} = require('../../Database/authorization');
const MAX_VALIDITY = 3 * 24 * 60 * 60;

function renderPage(req, res) {
    return res.render('login', {
        layout: 'layout2',
        pre: 'Log in',
    });
}

async function postHandler(req, res) {
    const {email, password} = req.body;
    let user = await db_login(email, password);
    if (user) {
        res.cookie('jwt', createToken(user.ID), {httpOnly: true, maxAge: MAX_VALIDITY * 1000});
        if (user.USER_TYPE === 'owner')
            res.redirect('/owner/profile');
        else if (user.USER_TYPE === 'tenant')
            res.redirect('/tenant/profile');
    } else {
        console.log('no such user ... ');
        res.redirect('/login');
    }
}

module.exports = {
    renderPage, postHandler
}