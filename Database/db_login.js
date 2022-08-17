const database = require("./database");

async function db_login(email, pass) {
    let sql = `select *
               from person
               where EMAIL = :email
                 and PASSWORD = :password`;
    let binds = {
        email: email, password: pass
    }
    let result = await database.execute(sql, binds);
    // console.log('db_login result:', result.rows[0]);
    return result.rows[0];
}

module.exports = {db_login};