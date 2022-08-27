const {extractToken} = require("../../Database/authorization");
const {
    db_postRequest,
    db_isRequested,
    db_removeRequest,
    db_confirmDeal
} = require("../../Database/db_request-follow-leave");
const {db_getHouseDetails} = require("../../Database/db_house");

async function handler(req, res) {
    const hid = Number(req.params.hid);
    const action = req.params.action;
    const tid = req.params.tid;
    const token_id = extractToken(req).id;

    if (action === 'leave') {
        let tid = (await db_getHouseDetails(hid)).TENANT_ID;
        let leaveNoticeIssued = await db_isRequested(hid, tid, 'leave');

        if (leaveNoticeIssued)
            await db_removeRequest(hid, tid, 'leave');
        else
            await db_postRequest(hid, token_id, 'leave');
    } else if (action === 'request') {
        let isRequested = await db_isRequested(hid, token_id, 'request');
        if (isRequested)
            await db_removeRequest(hid, token_id, 'request');
        else
            await db_postRequest(hid, token_id, 'request');
    } else if (action === 'follow') {
        let isFollowed = await db_isRequested(hid, token_id, 'follow');
        if (isFollowed)
            await db_removeRequest(hid, token_id, 'follow');
        else
            await db_postRequest(hid, token_id, 'follow');
    } else if (action === 'deal') {
        await db_confirmDeal(hid, tid);
    }

    return res.redirect(`/house/${hid}`);
}

module.exports = {
    handler,
}