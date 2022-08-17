const database = require("./database");

async function db_getCount(id) {
    const binds = {id: id};
    let sql = `select count(*) as cnt
               from HOUSE
               where OWNER_ID = :id`
    const res1 = await database.execute(sql, binds);
    sql = `select count(*) as cnt
           from HOUSE
           where OWNER_ID = :id
             and VACANT = 'yes'`
    const res2 = await database.execute(sql, binds);
    // console.log('db_getCount------------------\n', res1.rows, res2.rows);
    return {
        total: res1.rows[0].CNT,
        vacant: res2.rows[0].CNT,
    }
}

module.exports = {
    db_getCount
}