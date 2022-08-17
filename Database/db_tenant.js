const database = require("./database");

async function db_getHouse(id) {
    const binds = {id: id};
    let sql = `select H.HOUSE_ID, OWNER_ID
               from TENANT
                        join HOUSE H on TENANT.HOUSE_ID = H.HOUSE_ID
               where TENANT_ID = :id`
    const res = await database.execute(sql, binds);
    // console.log('getHouse:  ', res.rows[0]);
    return res.rows[0];
}

module.exports = {
    db_getHouse
}