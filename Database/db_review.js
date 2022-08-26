const database = require("./database");

// owner reviews tenant
async function db_postReviewOnTenant(oid, tid, rating, comment) {
    const binds = {oid: Number(oid), tid: Number(tid), rating: Number(rating), statement: comment};
    let sql = `insert into OWNER_TO_TENANT_REVIEW(statement, rating, owner_id, tenant_id)
               values (:statement, :rating, :oid, :tid)`;
    await database.execute(sql, binds);
}

// tenant reviews house
async function db_postReviewOnHouse(tid, hid, rating, comment) {
    const binds = {hid: hid, tid: tid, rating: rating, statement: comment};
    let sql = `insert into TENANT_TO_HOUSE_REVIEW(statement, rating, house_id, tenant_id)
               values (:statement, :rating, :hid, :tid)`;
    await database.execute(sql, binds);
}

// get tenant/house comments list
async function db_getComments(id, type) {
    if (type == 'tenant') {
        let sql = `select statement,
                          rating,
                          to_char(time, 'DD-MON-YYYY, MM:HH AM')            as time,
                          owner_id,
                          tenant_id,
                          (select USERNAME from PERSON where ID = OWNER_ID) as owner_name,
                          (select PHOTO from PERSON where ID = OWNER_ID)    as owner_pic
                   from OWNER_TO_TENANT_REVIEW
                   where TENANT_ID = :id
                     and STATEMENT is not null
                   order by "TIME" desc`;
        const res = await database.execute(sql, {id: id});
        return res.rows;
    }
    if (type == 'house') {
        let sql = `select statement,
                          rating,
                          to_char(time, 'DD-MON-YYYY, HH:MI:SS AM')          as time,
                          house_id,
                          tenant_id,
                          (select USERNAME from PERSON where ID = TENANT_ID) as tenant_name,
                          (select PHOTO from PERSON where ID = TENANT_ID)    as tenant_pic
                   from TENANT_TO_HOUSE_REVIEW
                   where HOUSE_ID = :id
                     and STATEMENT is not null
                   order by "TIME" desc`;
        const res = await database.execute(sql, {id: id});
        return res.rows;
    }
}

module.exports = {
    db_postReviewOnHouse, db_postReviewOnTenant, db_getComments
}