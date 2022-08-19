const {extractToken} = require('../../Database/authorization');
const {db_getPerson, db_getPersonType, db_getRating} = require('../../Database/db_person');
const {db_getHouse} = require('../../Database/db_tenant')
const {db_getComments} = require("../../Database/db_review");

async function renderPage(req, res) {
    let id = req.params.id;
    let token = extractToken(req);
    let type = await db_getPersonType(token.id);
    if (!id && type !== 'tenant')
        res.redirect('/login');

    let tenant, house, rating, canReview, reviewer;
    tenant = await db_getPerson(id ? id : token.id);
    house = await db_getHouse(id ? id : token.id);
    rating = await db_getRating(id ? id : token.id, 'tenant');

    const ratingArr = [{RATING: 5, COUNT: 0},
        {RATING: 4, COUNT: 0},
        {RATING: 3, COUNT: 0},
        {RATING: 2, COUNT: 0},
        {RATING: 1, COUNT: 0}];
    rating.arr.forEach(e => ratingArr[5 - e.RATING].COUNT = e.COUNT);

    if (house && token.id === house.OWNER_ID) {
        canReview = true;
        reviewer = await db_getPerson(token.id);
    }

    let commentArr = await db_getComments(id ? id : token.id, 'tenant');

    return res.render('profile-tenant', {
        pre: tenant.USERNAME + `'s Profile`,
        isTenant: type === 'tenant',
        type: "Tenant",
        id: tenant.ID,
        name: tenant.USERNAME,
        job: tenant.JOB,
        house_id: tenant.HOUSE_ID,
        members: tenant.FAMILY_MEMBERS,
        category: tenant.CATEGORY,
        location: tenant.AREA + ', ' + tenant.SUBURB + ', ' + tenant.DISTRICT,
        email: tenant.EMAIL,
        phone: tenant.PHONE,
        avg_rating: rating.avg,
        ratingArr: ratingArr,
        ratingTotalCount: rating.arr.reduce((t, n) => t += n.COUNT, 0),
        isViewer: id && (token.id != id),
        canReview: canReview,
        reviewer: reviewer,
        commentArr : commentArr
    });
}

module.exports = {
    renderPage
}
