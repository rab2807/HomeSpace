const {
    db_getHouseDetails,
    db_getHouseRating,
    db_updateProPic,
    db_uploadPictures,
    db_getPictures
} = require("../../Database/db_house");
const {extractToken} = require("../../Database/authorization");
const {db_getPersonType, db_getPerson} = require("../../Database/db_person");
const {db_isRequested} = require("../../Database/db_request-follow-leave");
const {db_getComments} = require("../../Database/db_review");
const {saveImages} = require("../../config/multer");

async function renderPage(req, res) {
    const hid = req.params.house_id;
    const token_id = extractToken(req).id;
    const house = await db_getHouseDetails(hid);
    const rating = await db_getHouseRating(hid);

    let action = undefined, leaveNoticeIssued, requestButtonText, canReview, reviewer;
    if (house.OWNER_ID === token_id) {
        requestButtonText = 'Edit Info';
        leaveNoticeIssued = await db_isRequested(hid, house.TENANT_ID, 'leave');
    } else if (house.TENANT_ID && house.TENANT_ID === token_id) {
        action = 'leave';
        let isRequested = await db_isRequested(hid, token_id, 'leave');
        requestButtonText = isRequested ? 'Leave notice sent' : 'Leave';
    } else if (await db_getPersonType(token_id) === 'tenant' && house.VACANT === 'yes') {
        action = 'request';
        let isRequested = await db_isRequested(hid, token_id, 'request');
        requestButtonText = isRequested ? 'Cancel request' : 'Request';
    } else if (await db_getPersonType(token_id) === 'tenant' && house.VACANT === 'no') {
        action = 'follow';
        let isRequested = await db_isRequested(hid, token_id, 'follow');
        requestButtonText = isRequested ? 'Unfollow' : 'Follow';
    }

    const ratingArr = [{RATING: 5, COUNT: 0},
        {RATING: 4, COUNT: 0},
        {RATING: 3, COUNT: 0},
        {RATING: 2, COUNT: 0},
        {RATING: 1, COUNT: 0}];
    rating.arr.forEach(e => ratingArr[5 - e.RATING].COUNT = e.COUNT);
    if (requestButtonText === 'Leave notice sent' || requestButtonText === 'Leave') {
        canReview = true;
        reviewer = await db_getPerson(token_id);
    }
    let commentArr = await db_getComments(house.HOUSE_ID, 'house');
    let imageArr = await db_getPictures(house.HOUSE_ID);

    res.render('house-details', {
        pre: `House - ${house.HOUSE_ID}`,
        id: token_id,
        isHouse: true,
        isOwner: (await db_getPersonType(token_id) === 'owner'),
        userID: token_id,
        action: action,
        leaveNoticeIssued: leaveNoticeIssued,
        requestButtonText: requestButtonText,
        images: imageArr,
        house: house,
        commentArr: commentArr,
        canReview: canReview,
        reviewer: reviewer,
        ratingArr: ratingArr,
        avg_rating: rating.avg,
        ratingTotalCount: rating.arr.reduce((t, n) => t += n.COUNT, 0),
    });
}

async function postHandler(req, res) {
    saveImages(req, res, async () => {
        const data = req.body;
        let filenames = req.files.map(function (file) {
            return file.filename;
        });

        if (data.type === 'propic') {
            try {
                await db_updateProPic(data.id, filenames[0]);
            } catch (e) {
            } finally {
                return res.redirect(`/house/${data.id}`);
            }
        } else if (data.type === 'otherpic') {
            try {
                await db_uploadPictures(data.id, filenames);
            } catch (e) {
            } finally {
                return res.redirect(`/house/${data.id}`);
            }
        }
    });
}

module.exports = {
    renderPage, postHandler
}