const {db_getHousesFromPerson} = require('../../Database/db_house');
const {extractToken} = require("../../Database/authorization");

async function renderPage(req, res) {
    const id = req.params.owner_id;
    let sort = 'RATING', order = 'DESC';
    if (req.query.sort && req.query.sort !== '')
        sort = req.query.sort;
    if (req.query.order && req.query.order !== '')
        order = req.query.order;

    const token_id = extractToken(req).id;
    const type = (token_id == id) ? 'owner' : 'tenant';

    let houseArr = await db_getHousesFromPerson(id, sort, order);

    return res.render('house-menu', {
        id: Number(id),
        isOwner: type === 'owner',
        house: houseArr,
        sort: sort,
        order: order
    });
}

module.exports = {
    renderPage
}
