const {extractToken} = require("../../Database/authorization");
const {db_getPersonType} = require("../../Database/db_person");
const {db_getHistory_owner} = require("../../Database/db_history");

async function renderPage(req, res) {
    const token = extractToken(req);
    const isOwner = await db_getPersonType(token.id) === 'owner';
    if (!isOwner)
        return res.redirect('/login');

    const historyArr = await db_getHistory_owner(token.id);

    return res.render('history', {
        pre: 'History',
        isOwner: isOwner,
        type: 'owner',
        id: token.id,
        historyArr: historyArr,
    });
}

module.exports = {
    renderPage
}
