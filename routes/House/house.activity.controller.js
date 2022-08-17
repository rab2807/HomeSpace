const {extractToken} = require("../../Database/authorization");
const {db_getHouseActivity} = require("../../Database/db_house");
const {db_getPersonType} = require("../../Database/db_person");

async function renderPage(req, res) {
    const hid = req.params.hid;

    const token = extractToken(req);
    if (await db_getPersonType(token.id) !== 'owner')
        return res.redirect('/login');
    let arr = await db_getHouseActivity(hid, 'request');

    return res.render('house-activity', {
        id: token.id,
        isOwner: (await db_getPersonType(token.id) === 'owner'),
        arr: arr,
    });
}

function postHandler(req, res) {

}

module.exports = {
    renderPage, postHandler
}
