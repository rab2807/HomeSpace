const {db_houseForm} = require('../../Database/db_house');
const {extractToken} = require("../../Database/authorization");

function renderPage(req, res) {
    res.render('house-form', {});
}

async function postForm(req, res) {
    const token = extractToken(req);
    await db_houseForm(req.body, token.id);
    res.redirect('/owner/house');
}

module.exports = {
    renderPage, postForm,
}