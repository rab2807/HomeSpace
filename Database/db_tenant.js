const database = require("./database");

// get house info of tenant's current house
async function db_getHouse(id) {
    const binds = {id: id};
    let sql = `select H.HOUSE_ID, OWNER_ID
               from TENANT
                        join HOUSE H on TENANT.HOUSE_ID = H.HOUSE_ID
               where TENANT_ID = :id`
    const res = await database.execute(sql, binds);
    return res.rows[0];
}

async function db_editProfile(person) {
    let sql = `begin
                UPDATE_USER(:id, :username, :oldPass, :newPass, :phone, :email, job_=>:job, members=>:members);
               end;`;
    let binds = {
        id: person.id,
        username: person.username,
        oldPass: person.oldPass,
        newPass: person.newPass,
        phone: person.phone,
        email: person.email,
        job: person.job,
        members: person.members
    }
    await database.execute(sql, binds);
}

module.exports = {
    db_getHouse, db_editProfile
}