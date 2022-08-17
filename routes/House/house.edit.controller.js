const {db_getHouseDetails, db_editHouseInfo} = require("../../Database/db_house");
const {extractToken} = require("../../Database/authorization");
const {db_getPersonType} = require("../../Database/db_person");

async function renderPage(req, res) {
    const hid = req.params.hid;
    const token_id = extractToken(req).id;
    const house = await db_getHouseDetails(hid);
    console.log(house);

    res.render('house-edit', {
        id: token_id,
        isOwner: (await db_getPersonType(token_id) === 'owner'),
        userID: token_id,
        house: house,
    });
}

async function postHandler(req, res) {
    const hid = req.params.hid;
    await db_editHouseInfo(hid, req.body);
    return res.redirect(`/house/${hid}`);
}

module.exports = {
    renderPage, postHandler
}