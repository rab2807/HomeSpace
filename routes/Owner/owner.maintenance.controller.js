const {
    db_getMaintenanceHistory, db_loadCurrentMonth,
    db_resolveMaintenance
} = require("../../Database/db_maintenance_billing");
const {extractToken} = require("../../Database/authorization");
const {db_getPersonType} = require("../../Database/db_person");

async function renderPage(req, res) {
    const d = new Date();
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const monthName = months[d.getMonth()];
    const year = d.getFullYear();

    const token = extractToken(req);
    const isOwner = await db_getPersonType(token.id) === 'owner';
    if (!isOwner)
        return res.redirect('/login');

    await db_loadCurrentMonth(token.id, d.getMonth() + 1, year);
    let maintenanceArr = await db_getMaintenanceHistory(token.id, 'owner');

    return res.render('maintenance-owner', {
        pre: "Maintenance",
        isOwner: isOwner,
        id: token.id,
        month: monthName,
        year: year,
        maintenanceArr: maintenanceArr
    });
}

async function postHandler(req, res) {
    await db_resolveMaintenance(req.body.maintenance_id, req.body.cost);
    return res.redirect('/owner/maintenance');
}

module.exports = {
    renderPage, postHandler
}
