const {
    db_loadCurrentMonth, db_getUnpaidBillList, db_postMaintenance, db_resolveBilling
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

    await db_loadCurrentMonth(token.id, d.getMonth() + 1, year);
    const duesArr = await db_getUnpaidBillList(token.id, d.getMonth() + 1, year);

    return res.render('billing-tenant', {
        id: token.id,
        monthName: monthName,
        year: year,
        duesArr: duesArr,
        noDues: duesArr.length === 0
    });
}

async function postHandler(req, res) {
    const token = extractToken(req);
    const isTenant = await db_getPersonType(token.id) === 'tenant';
    if (!isTenant)
        return res.redirect('/login');

    const data = req.body;
    await db_resolveBilling(data.id, data.month, data.year);
    return res.redirect('/tenant/billing');
}

module.exports = {
    renderPage, postHandler
}
