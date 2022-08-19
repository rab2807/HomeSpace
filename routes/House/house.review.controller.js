const {db_postReviewOnHouse} = require("../../Database/db_review");

async function postHandler(req, res) {
    const data = req.body;
    if (!data.rating)
        return res.redirect(`/house/${data.house_id}`);
    else {
        console.log(data);
        await db_postReviewOnHouse(data.tenant_id, data.house_id, data.rating, data.comment);
        res.redirect(`/house/${data.house_id}`);
    }
}

module.exports = {
    postHandler
}
