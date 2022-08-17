const {extractToken} = require('../../Database/authorization');
const {db_getPerson, db_getPersonType, db_getRating} = require('../../Database/db_person');
const {db_getHouse} = require('../../Database/db_tenant')
const {db_getCount} = require("../../Database/db_owner");

async function renderPage(req, res) {
    let id = req.params.id;
    let token = extractToken(req);
    let type = await db_getPersonType(token.id);
    if (!id && type !== 'tenant')
        res.redirect('/login');

    let tenant, house, rating, canComment;
    tenant = await db_getPerson(id ? id : token.id);
    house = await db_getHouse(id ? id : token.id);
    rating = await db_getRating(id ? id : token.id, 'tenant');
    if (!tenant) return res.status(404).send("No data found");

    if (house && token.id === house.OWNER_ID)
        canComment = true;
    console.log(tenant);

    return res.render('profile-tenant', {
        pre: tenant.USERNAME + `'s Profile`,
        isOwner: type === 'owner',
        type: "Tenant",
        id: tenant.ID,
        name: tenant.USERNAME,
        job: tenant.JOB,
        house_id: tenant.HOUSE_ID,
        family: tenant.FAMILY_MEMBERS,
        category: tenant.CATEGORY,
        location: tenant.AREA + ', ' + tenant.SUBURB + ', ' + tenant.DISTRICT,
        email: tenant.EMAIL,
        phone: tenant.PHONE,
        avg_rating: rating.avg,
        ratingArr: rating.arr,
        ratingTotalCount: rating.arr.reduce((t, n) => t += n.COUNT, 0),
        canComment: canComment,
    });
}

module.exports = {
    renderPage
}
