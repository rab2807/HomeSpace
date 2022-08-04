const {db_getHouse} = require('../../Database/db_owner');
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
    const token = extractToken(req);
    houseArr = await db_getHouse(token.id);
    return res.render('house-menu', {
        house: houseArr,
    });
}

async function postHandler(req, res) {
    const token = extractToken(req);
    houseArr = await db_getHouse(token.id, req.body.sort);
    return res.render('house-menu', {
        house: houseArr,
    });
}

module.exports = {
    renderPage, postHandler
}
