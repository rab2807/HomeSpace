const {extractToken} = require('../../Database/authorization');
const {db_getPerson, db_getPersonType, db_getRating} = require('../../Database/db_person');
const {db_getCount} = require('../../Database/db_owner')

async function renderPage(req, res) {
    let id = req.params.id;
    let token = extractToken(req);
    let type = await db_getPersonType(token.id);
    if (!id && type !== 'owner')
        res.redirect('/login');

    let owner, count, rating;
    owner = await db_getPerson(id ? id : token.id);
    count = await db_getCount(id ? id : token.id);
    rating = await db_getRating(id ? id : token.id, 'owner');
    console.log(owner);
    if (!owner) return res.status(404).send("No data found");

    return res.render('profile-owner', {
        pre: owner.USERNAME + `'s Profile`,
        isOwner: type === 'owner',
        type: "Home-owner",
        id: owner.ID,
        name: owner.USERNAME,
        category: owner.CATEGORY,
        location: owner.AREA + ', ' + owner.SUBURB + ', ' + owner.DISTRICT,
        email: owner.EMAIL,
        phone: owner.PHONE,
        total_house_num: count.total,
        vacant_house_num: count.vacant,
        avg_rating: rating.avg,
        ratingArr: rating.arr,
        ratingTotalCount: rating.arr.reduce((t, n) => t += n.COUNT, 0),
    });
}

module.exports = {
    renderPage
}
