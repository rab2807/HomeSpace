const {
    db_loadCurrentMonth, db_getUnpaidBillList, db_postMaintenance, db_resolveBilling, db_getMaintenanceHistory
} = require("../../Database/db_maintenance_billing");
const {extractToken} = require("../../Database/authorization");
const {db_getPersonType} = require("../../Database/db_person");

async function renderPage(req, res) {
    const d = new Date();
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const monthName = months[d.getMonth()];
    const year = d.getFullYear();

    const token = extractToken(req);
    const isTenant = await db_getPersonType(token.id) === 'tenant';
    if (!isTenant)
        return res.redirect('/login');

    let maintenanceArr = await db_getMaintenanceHistory(token.id, 'tenant');
    console.log(maintenanceArr);

    return res.render('maintenance-tenant', {
        id: token.id,
        monthName: monthName,
        year: year,
        maintenanceArr: maintenanceArr,
    });
}

async function postHandler(req, res) {
    const token = extractToken(req);
    const isTenant = await db_getPersonType(token.id) === 'tenant';
    if (!isTenant)
        return res.redirect('/login');

    const data = req.body;
    if (data.type === 'maintenance')
        await db_postMaintenance(data.id, data.category, data.details);
    else if (data.type === 'billing')
        await db_resolveBilling(data.id, data.month, data.year);
    return res.redirect('/tenant/maintenance')
}

module.exports = {
    renderPage, postHandler
}
