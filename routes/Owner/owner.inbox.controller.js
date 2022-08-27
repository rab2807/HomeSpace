const {extractToken} = require("../../Database/authorization");
const {db_getPersonType} = require("../../Database/db_person");
const {db_getInbox, db_getUnseenMessageCount} = require("../../Database/db_message");

async function renderPage(req, res) {
    const token = extractToken(req);
    const isOwner = await db_getPersonType(token.id) === 'owner';
    if (!isOwner)
        return res.redirect('/login');

    const inboxArr = await db_getInbox(token.id);
    for (const e of inboxArr)
        e.UNSEEN = await db_getUnseenMessageCount(token.id, e.ID);

    return res.render('inbox', {
        isOwner: isOwner,
        id: token.id,
        inboxArr: inboxArr,
    });
}

module.exports = {
    renderPage
}
