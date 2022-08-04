const database = require('./database')

async function insertFunc() {
    const sql = `insert into person(username, password, phone, email, location_id, USER_TYPE)
                 values (:username, :password, :phone, :email, :location_id, :type)`;
    const rows =
        [
            {
                username: "Jonas",
                password: "123",
                phone: "01834142314",
                email: "sakib@gmail.com",
                pic_id: 201,
                location_id: null,
                type: "Owner"
            },
            {
                username: "Hamza",
                password: "ashgf32y",
                phone: "01834143314",
                email: "rab@gmail.com",
                pic_id: 241,
                location_id: null,
                type: "Tenant"
            },
        ];

    let results = await database.executeMany(sql, rows);
    console.log(results.rowsAffected, "rows inserted");
}

async function queryFunc() {
    const name = 'Jonas';
    const sql = `select phone, email
                 from person
                 where username = :name`;
    const binds = {name: name};
    const res = await database.execute(sql, binds);
    console.log(res);
}

module.exports = {
    insertFunc, queryFunc
}