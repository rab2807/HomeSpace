const {db_getNotification_owner} = require("../../Database/db_dashboard_owner");
const {extractToken} = require("../../Database/authorization");
const {db_getHousesFromPerson} = require("../../Database/db_house");
const {db_getPersonType} = require("../../Database/db_person");

async function renderPage(req, res) {
    const hid = req.query.hid;
    const activity = req.query.activity;

    const token = extractToken(req);
    let notiArr = await db_getNotification_owner(token.id, hid, activity);
    let houseArr = await db_getHousesFromPerson(token.id);

    return res.render('dashboard-owner', {
        isOwner: (await db_getPersonType(token.id) === 'owner'),
        id: token.id,
        notification: notiArr,
        house: houseArr,
        hid: hid,
        activity: activity
    });
}

function postHandler(req, res) {

}

module.exports = {
    renderPage, postHandler
}
