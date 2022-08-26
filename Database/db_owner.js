const database = require("./database");

// get house count
async function db_getCount(id) {
    // total houses
    const binds = {id: id};
    let sql = `select count(*) as cnt
               from HOUSE
               where OWNER_ID = :id`
    const res1 = await database.execute(sql, binds);

    // vacant houses
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

// edit profile info
async function db_editProfile(person) {
    let sql = `begin
                UPDATE_USER(:id, :username, :oldPass, :newPass, :phone, :email, category_=>:category);
               end;`;
    let binds = {
        id: person.id,
        username: person.username,
        oldPass: person.old_password,
        newPass: person.new_password,
        phone: person.phone,
        email: person.email,
        category: person.category
    }
    await database.execute(sql, binds);
}


module.exports = {
    db_getCount, db_editProfile
}