const {db_postReviewOnTenant} = require("../../Database/db_review");

async function postHandler(req, res) {
    const data = req.body;
    if (!data.rating)
        return res.redirect(`/tenant/profile/${data.tenant_id}`);
    else {
        await db_postReviewOnTenant(data.owner_id, data.tenant_id, data.rating, data.comment);
        return res.redirect(`/tenant/profile/${data.tenant_id}`);
    }
}

module.exports = {
    postHandler
}
