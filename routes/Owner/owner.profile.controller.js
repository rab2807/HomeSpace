const {extractToken} = require('../../Database/authorization');
const {db_getPerson, db_getPersonType, db_getRating, db_updateProPic} = require('../../Database/db_person');
const {db_getCount} = require('../../Database/db_owner')
const {saveImage} = require('../../config/multer')

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

    const ratingArr = [{RATING: 5, COUNT: 0},
        {RATING: 4, COUNT: 0},
        {RATING: 3, COUNT: 0},
        {RATING: 2, COUNT: 0},
        {RATING: 1, COUNT: 0}];
    rating.arr.forEach(e => ratingArr[5 - e.RATING].COUNT = e.COUNT);

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
        photo: owner.PHOTO ? `${owner.PHOTO}` : 'default.jpg',
        total_house_num: count.total,
        vacant_house_num: count.vacant,
        avg_rating: rating.avg,
        ratingArr: ratingArr,
        ratingTotalCount: rating.arr.reduce((t, n) => t += n.COUNT, 0),
        isViewer: id && (token.id != id),
        viewerID: token.id
    });
}

async function postHandler(req, res) {
    saveImage(req, res, async () => {
        let token = extractToken(req);
        let type = await db_getPersonType(token.id);
        if (type !== 'owner')
            res.redirect('/login');

        if (req.file.filename)
            await db_updateProPic(token.id, req.file.filename);
        return res.redirect('/owner/profile');
    });
}

module.exports = {
    renderPage, postHandler
}
