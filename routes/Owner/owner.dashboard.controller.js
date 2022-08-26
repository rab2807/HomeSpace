const {db_getNotification_owner} = require("../../Database/db_dashboard_owner");
const {extractToken} = require("../../Database/authorization");
const {db_getHousesFromPerson} = require("../../Database/db_house");
const {db_getPersonType} = require("../../Database/db_person");
const {db_getBillingInfo} = require("../../Database/db_maintenance_billing");

async function renderPage(req, res) {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const hid = req.query.hid;
    const activity = req.query.activity;

    const token = extractToken(req);
    let notiArr = await db_getNotification_owner(token.id, hid, activity);
    let houseArr = await db_getHousesFromPerson(token.id);

    for (const e of notiArr) {
        if (e.NOTIFICATION_TYPE === 'billing-resolve') {
            const billInfo = await db_getBillingInfo(e.ACTIVITY_ID);
            e.MONTH = months[billInfo.MONTH - 1];
            e.YEAR = billInfo.YEAR;
            e.PAID = billInfo.PAID;
        }
    }

    return res.render('dashboard-owner', {
        isOwner: (await db_getPersonType(token.id) === 'owner'),
        id: token.id,
        notification: notiArr,
        house: houseArr,
        hid: hid,
        activity: activity
    });
}

module.exports = {
    renderPage
}
