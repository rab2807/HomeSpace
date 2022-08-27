const {extractToken} = require("../../Database/authorization");
const {db_getPersonType} = require("../../Database/db_person");
const {db_getHistory_tenant} = require("../../Database/db_history");

async function renderPage(req, res) {
    const token = extractToken(req);
    const isTenant = await db_getPersonType(token.id) === 'tenant';
    if (!isTenant)
        return res.redirect('/login');

    const historyArr = await db_getHistory_tenant(token.id);
    console.log(historyArr);

    return res.render('history', {
        pre: 'History',
        isTenant: isTenant,
        type: 'tenant',
        id: token.id,
        historyArr: historyArr,
    });
}

module.exports = {
    renderPage
}
