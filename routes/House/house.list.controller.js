const {db_getHousesFromPerson} = require('../../Database/db_house');
const {extractToken} = require("../../Database/authorization");

let houseArr = [
    {
        name: "XE23523",
        location: "Dhaka, Bangladesh",
        rating: "3.7",
        price: 15000
    },
    {
        name: "DE92837",
        location: "Dhaka, Bangladesh",
        rating: "3.1",
        price: 15000
    },
    {
        name: "XE23523",
        location: "Dhaka, Bangladesh",
        rating: "4.7",
        price: 15000
    },
]

async function renderPage(req, res) {
    const id = req.params.owner_id;
    let sort = 'RATING', order = 'DESC';
    if (req.params.sort && req.params.sort !== '')
        sort = req.params.sort;
    if (req.params.order && req.params.order !== '')
        order = req.params.order;

    const token_id = extractToken(req).id;
    const type = (token_id == id) ? 'owner' : 'tenant';

    houseArr = await db_getHousesFromPerson(id, sort, order);

    return res.render('house-menu', {
        id: Number(id),
        isOwner: type === 'owner',
        house: houseArr,
    });
}

module.exports = {
    renderPage
}
