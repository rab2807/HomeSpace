const database = require("./database");

async function db_getHouse(id, sort = 'rating') {
    let sql = `select *
               from house join hous
               where OWNER_ID = :id
               order by :sort`;
    let binds = {id: id, sort: sort};
    return (await database.execute(sql, binds)).rows;
}

module.exports = {
    db_getHouse
}