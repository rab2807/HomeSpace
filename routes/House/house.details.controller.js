const {db_getHouseDetails, db_getHouseRating} = require("../../Database/db_house");
const {extractToken} = require("../../Database/authorization");
const {db_getPersonType} = require("../../Database/db_person");
const {db_isRequested} = require("../../Database/db_request-follow-leave");

const imageArr = [0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3];

let commentArr = [
    {
        // picture link should be added
        name: "Rakib",
        post_date: "21 July 2020",
        star: "⭐⭐⭐",
        comment: "bal sal",
    },
    {
        name: "Ahsan",
        post_date: "21 Feb 2020",
        star: "⭐⭐⭐⭐",
        comment: "bal sal",
    }
]

async function renderPage(req, res) {
    const hid = req.params.house_id;
    const token_id = extractToken(req).id;
    const house = await db_getHouseDetails(hid);
    const rating = await db_getHouseRating(hid);

    let action = undefined, leaveNoticeIssued, requestButtonText;
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

    res.render('house-details', {
        id: token_id,
        isOwner: (await db_getPersonType(token_id) === 'owner'),
        userID: token_id,
        action: action,
        leaveNoticeIssued: leaveNoticeIssued,
        requestButtonText: requestButtonText,
        images: imageArr,
        house: house,
        comments: commentArr,
        ratingArr: rating.arr,
        avg_rating: rating.avg,
        ratingTotalCount: rating.arr.reduce((t, n) => t += n.COUNT, 0),
    });
}

module.exports = {
    renderPage,
}