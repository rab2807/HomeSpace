const {extractToken} = require("../../Database/authorization");
const {db_getPersonType} = require("../../Database/db_person");
const {db_getInbox, db_getUnseenMessageCount} = require("../../Database/db_message");

async function renderPage(req, res) {
    const token = extractToken(req);
    const isTenant = await db_getPersonType(token.id) === 'tenant';
    if (!isTenant)
        return res.redirect('/login');

    const inboxArr = await db_getInbox(token.id);
    for (const e of inboxArr)
        e.UNSEEN = await db_getUnseenMessageCount(token.id, e.ID);

    return res.render('inbox', {
        isTenant: isTenant,
        id: token.id,
        inboxArr: inboxArr,
    });
}

module.exports = {
    renderPage
}
