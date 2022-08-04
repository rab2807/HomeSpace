const database = require('../../Database/database');
const jwt = require('jsonwebtoken');

function renderPage(req, res) {
    return res.render('login', {
        layout: 'layout2',
        pre: 'Registration',
        type: req.params['userType'],
        cndtn: req.params['userType'] === 'owner',
    });
}

async function db_login(email, pass) {
    let sql = 'select * from person where EMAIL = :email and PASSWORD = :password';
    let binds = {
        email: email,
        password: pass
    }
    let result = await database.execute(sql, binds);
    console.log('db_login result:', result.rows[0]);
    return result.rows[0];
}

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
    return jwt.sign({id}, process.env.DB_PRIVKEY, {
        expiresIn: maxAge
    });
};

async function postHandler(req, res) {
    const {email, password} = req.body;
    let user = await db_login(email, password);
    if (user) {
        res.cookie('jwt', createToken(user.ID), {httpOnly: true, maxAge: maxAge * 1000});
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