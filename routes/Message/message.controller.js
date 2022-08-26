const {db_getMessages, db_postMessage, db_seenZoneMessage} = require("../../Database/db_message");
const {extractToken} = require("../../Database/authorization");
const {db_getPersonType} = require("../../Database/db_person");

async function renderPage(req, res) {
    let id1 = req.params.id1;
    let id2 = req.params.id2;
    const msgArr = await db_getMessages(id1, id2);
    await db_seenZoneMessage(id1, id2);

    const token = extractToken(req);
    let isOwner = (await db_getPersonType(token.id)) === 'owner';

    return res.render('message', {
        id: token.id,
        isOwner: isOwner,
        pre: 'Message',
        sender: id1,
        receiver: id2,
        msgArr: msgArr
    });
}

async function postHandler(req, res) {
    const data = req.body;
    await db_postMessage(data.id1, data.id2, data.msg);
    return res.redirect(`/message/${data.id1}/${data.id2}`);
}

module.exports = {
    renderPage, postHandler
}