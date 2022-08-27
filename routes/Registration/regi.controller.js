const {db_registration} = require('../../Database/db_registration');

function renderPage(req, res) {
    const type = req.params.userType;
    const error = req.params.error;
    let errorMessage;

    if (error == 1)
        errorMessage = 'Password, phone number and email address must be unique';
    else if (error == 1400)
        errorMessage = 'Password, phone number and email address cannot be null';
    else if (error == 2290)
        errorMessage = 'Password should be at least 8 characters long';
    else if (error == 2291)
        errorMessage = 'Only gmail and yahoo accounts are allowed';

    console.log(errorMessage)
    if (type === 'owner' || type === 'tenant')
        return res.render('regi', {
            layout: 'layout2',
            pre: 'Registration',
            type: req.params['userType'],
            cndtn: req.params['userType'] === 'owner',
            errorMessage: errorMessage
        });
    else return res.status(400).send({
        message: 'This is an error!'
    });
}

async function registerUser(req, res) {
    const data = req.body;
    try {
        await db_registration(data);
    } catch (e) {
        console.log('error', e.errorNum);
        let errMsg = e.message;
        if (errMsg.indexOf('EMAIL_CHECK') !== -1)
            e.errorNum++;

        return res.redirect(`/regi/${data.type}/${e.errorNum}`);
    }
    return res.redirect('/login');
}

module.exports = {
    renderPage, registerUser,
}