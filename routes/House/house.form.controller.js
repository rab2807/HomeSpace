const {db_houseForm} = require('../../Database/db_house');
const {extractToken} = require("../../Database/authorization");
const {db_getPersonType} = require("../../Database/db_person");

async function renderPage(req, res) {
    let token_id = extractToken(req).id;
    return res.render('house-form', {
        pre: 'House Registration',
        id: token_id,
        isOwner: (await db_getPersonType(token_id) === 'owner'),
    });
}

async function postForm(req, res) {
    const token = extractToken(req);
    await db_houseForm(req.body, token.id);
    res.redirect(`/house/list/${token.id}`);
}

module.exports = {
    renderPage, postForm,
}