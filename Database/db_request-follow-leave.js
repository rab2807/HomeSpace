const database = require("./database");

async function db_postRequest(hid, tid, type) {
    const binds = {tid: tid, hid: hid};
    let sql = `insert into ${type}(HOUSE_ID, TENANT_ID)
               values (:hid, :tid)`
    await database.execute(sql, binds);
}

async function db_removeRequest(hid, tid, type) {
    const binds = {tid: tid, hid: hid};

    let sql = `delete
               from ${type}
               where HOUSE_ID = :hid 
                 and TENANT_ID = :tid`;
    await database.execute(sql, binds);
}

// check if a tenant has already followed/requested for a house
async function db_isRequested(hid, tid, type) {
    const binds = {tid: tid, hid: hid};
    let sql = `select count(*) as cnt
               from ${type}
               where HOUSE_ID = :hid
                 and TENANT_ID = :tid`;
    const res = await database.execute(sql, binds);
    return res.rows[0].CNT > 0;
}

async function db_confirmDeal(hid, tid) {
    let sql = `insert into DEAL(house_id, tenant_id, price)
               values (:hid, :tid, (select price from HOUSE where HOUSE_ID = :hid))`;
    let binds = {hid: hid, tid: tid}
    await database.execute(sql, binds);
}

module.exports = {
    db_postRequest, db_removeRequest, db_isRequested, db_confirmDeal
}