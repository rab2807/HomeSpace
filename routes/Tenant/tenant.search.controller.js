const {db_searchHouse} = require("../../Database/db_search");

// http://localhost:3000/tenant/search?suburb=&district=&vacant=yes&rating_low=&rating_high=&price_low=&price_high=&space=&floor=&bedroom=&bathroom=&ownerName=&ownerRating_low=&ownerRating_high=&sort=rating
async function renderPage(req, res) {
    let search = {
        suburb: req.query.suburb ? req.query.suburb : '',
        district: req.query.district ? req.query.district : '',
        vacant: req.query.vacant ? req.query.vacant : '',
        rating_low: req.query.rating_low ? req.query.rating_low : '',
        rating_high: req.query.rating_high ? req.query.rating_high : '',
        price_low: req.query.price_low ? req.query.price_low : '',
        price_high: req.query.price_high ? req.query.price_high : '',
        space: req.query.space ? req.query.space : '',
        floor: req.query.floor ? req.query.floor : '',
        bedroom: req.query.bedroom ? req.query.bedroom : '',
        bathroom: req.query.bathroom ? req.query.bathroom : '',
        sort: req.query.sort ? req.query.sort : '',
        order: req.query.order ? req.query.order : ''
    }

    let houseArr = await db_searchHouse(search);
    console.log(houseArr);
    return res.render('search', {
        house: houseArr,
        search: search
    });
}

module.exports = {
    renderPage,
}
