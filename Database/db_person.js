const database = require("./database");

// person info
async function db_getPerson(id) {
    const binds = {id: id};
    let type = await db_getPersonType(id);
    let str = (type === 'owner') ? `CATEGORY` : `JOB, HOUSE_ID, FAMILY_MEMBERS`
    const sql = `select ID,
                        USERNAME,
                        PASSWORD,
                        EMAIL,
                        PHONE,
                        AREA,
                        SUBURB,
                        DISTRICT,
                        PHOTO,
                        ${str}
                 from PERSON P
                          join LOCATION L on P.LOCATION_ID = L.LOCATION_ID
                          join ${type} O on P.ID = O.${type}_ID
                 where ID = :id`;
    const res = await database.execute(sql, binds);
    // console.log('db_getPerson------------------\n', res.rows);
    return res.rows[0];
}

// if the person is owner or tenant
async function db_getPersonType(id) {
    return (await database.execute(`select user_type
                                    from PERSON
                                    where ID = :id`, {id: id})).rows[0].USER_TYPE;
}

// get person rating
async function db_getRating(id, type) {
    let sql = `select *
               from GET_RATING(:id, :type)`
    const res1 = await database.execute(sql, {id: id, type: type});

    sql = `begin :ret := GET_AVG_RATING(:id, :type); end;`
    let binds = {
        id: id, type: type, ret: {dir: oracledb.BIND_OUT, type: oracledb.NUMBER}
    }
    const res2 = await database.execute(sql, binds);
    let arr = [{RATING: 5, COUNT: 0}, {RATING: 4, COUNT: 0}, {RATING: 3, COUNT: 0}, {RATING: 2, COUNT: 0}, {
        RATING: 1, COUNT: 0
    },];
    if (res1.rows.length !== 0) arr = res1.rows;

    return {
        arr: arr, avg: res2.outBinds.ret,
    }
}

async function db_updateProPic(id, file) {
    let sql = `update PERSON
               set PHOTO = :fileName
               where ID = :id`;
    await database.execute(sql, {id: id, fileName: file});
}

module.exports = {
    db_getPerson, db_getRating, db_getPersonType, db_updateProPic
}