const {db_editProfile} = require("../../Database/db_tenant");
const {db_getPerson} = require("../../Database/db_person");
const {extractToken} = require("../../Database/authorization");
const {db_getPersonType} = require("../../Database/db_person");

async function renderPage(req, res) {
    const token = extractToken(req);
    const isTenant = await db_getPersonType(token.id) === 'tenant';
    if (!isTenant)
        return res.redirect('/login');

    const person = await db_getPerson(token.id);
    return res.render('profile-edit', {
        id: token.id,
        person: person,
    });
}

async function postHandler(req, res) {
    const token = extractToken(req);
    const isTenant = await db_getPersonType(token.id) === 'tenant';
    if (!isTenant)
        return res.redirect('/login');

    const data = req.body;
    try {
        await db_editProfile(data);
    } catch (e) {
        console.log(e.errorNum);
        return res.redirect('/tenant/edit')
    }
    return res.redirect('/tenant/profile');
}

module.exports = {
    renderPage, postHandler
}
