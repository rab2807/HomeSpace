const database = require('../Database/database');

async function db_getHistory_owner(id) {
    let sql = `select house_id,
                      tenant_id,
                      (select USERNAME
                       from PERSON P
                       where P.ID = tenant_id)            tenant_name,
                      to_char(start_date, 'DD-MON-YYYY')  join_date,
                      to_char(END_DATE, 'DD-MON-YYYY')    leave_date,
                      round(END_DATE) - round(START_DATE) duration
               from DEAL
               where HOUSE_ID in (select HOUSE_ID
                                  from HOUSE
                                  where OWNER_ID = :owner_id)
               order by START_DATE desc`;
    let res = await database.execute(sql, {owner_id: id});
    return res.rows;
}

async function db_getHistory_house(id) {
    let sql = `select house_id,
                      tenant_id,
                      (select USERNAME
                       from PERSON P
                       where P.ID = TENANT_ID)            tenant_name,
                      to_char(start_date, 'DD-MON-YYYY')  join_date,
                      to_char(END_DATE, 'DD-MON-YYYY')    leave_date,
                      round(END_DATE) - round(START_DATE) duration
               from DEAL
               where HOUSE_ID = :id
               order by START_DATE desc`;
    let res = await database.execute(sql, {id: id});
    return res.rows;
}

async function db_getHistory_tenant(id) {
    let sql = `select house_id,
                      tenant_id,
                      (select USERNAME
                       from PERSON P
                       where P.ID = TENANT_ID)            tenant_name,
                      to_char(start_date, 'DD-MON-YYYY')  join_date,
                      to_char(END_DATE, 'DD-MON-YYYY')    leave_date,
                      round(END_DATE) - round(START_DATE) duration
               from DEAL
               where TENANT_ID = :id
               order by START_DATE desc`;
    let res = await database.execute(sql, {id: id});
    return res.rows;
}

module.exports = {
    db_getHistory_tenant, db_getHistory_owner, db_getHistory_house
}