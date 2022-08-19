const {db_editProfile} = require("../../Database/db_owner");
const {db_getPerson} = require("../../Database/db_person");
const {extractToken} = require("../../Database/authorization");
const {db_getPersonType} = require("../../Database/db_person");

async function renderPage(req, res) {
    const token = extractToken(req);
    const isOwner = await db_getPersonType(token.id) === 'owner';
    if (!isOwner)
        return res.redirect('/login');

    const person = await db_getPerson(token.id);
    return res.render('profile-edit', {
        id: token.id,
        isOwner: isOwner,
        person: person,
    });
}

async function postHandler(req, res) {
    const token = extractToken(req);
    const isOwner = await db_getPersonType(token.id) === 'owner';
    if (!isOwner)
        return res.redirect('/login');

    const data = req.body;
    try {
        await db_editProfile(data);
    } catch (e) {
        console.log(e.errorNum);
        return res.redirect('/owner/edit')
    }
    return res.redirect('/owner/profile');
}

module.exports = {
    renderPage, postHandler
}
