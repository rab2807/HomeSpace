const {db_getNotification_tenant} = require("../../Database/db_dashboard_owner");
const {extractToken} = require("../../Database/authorization");
const {db_getPersonType} = require("../../Database/db_person");

async function renderPage(req, res) {
    const token = extractToken(req);
    let notiArr = await db_getNotification_tenant(token.id);

    return res.render('dashboard-owner', {
        isOwner : (await db_getPersonType(token.id) === 'owner'),
        notification: notiArr,
    });
}

module.exports = {
    renderPage
}
