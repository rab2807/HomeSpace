const {
    db_getExpectedRevenue,
    db_getGainedRevenue,
    db_getPreviousDues, db_getExpense, db_getBillingHistory, db_getMaintenanceHistory, db_loadCurrentMonth,
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
    let expectedRev = await db_getExpectedRevenue(token.id);
    let gainedRev = await db_getGainedRevenue(token.id, d.getMonth() + 1, year);
    let previousDues = await db_getPreviousDues(token.id, d.getMonth() + 1, year);
    let expense = await db_getExpense(token.id, d.getMonth() + 1, year);
    let billingArr = await db_getBillingHistory(token.id);

    return res.render('billing-owner', {
        isOwner: isOwner,
        id: token.id,
        month: monthName,
        year: year,
        expectedRev: expectedRev,
        gainedRev: gainedRev,
        previousDues: previousDues,
        expense: expense,
        billingArr: billingArr,
    });
}

async function postHandler(req, res) {
    await db_resolveMaintenance(req.body.mid, req.body.cost);
    return await renderPage(req, res);
}

module.exports = {
    renderPage, postHandler
}
