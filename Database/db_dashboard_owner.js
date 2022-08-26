const database = require('../Database/database');

async function db_getNotification_owner(owner_id, hid, activity) {
    let str = '';
    if (hid && hid !== '') str = str.concat(`and HOUSE_ID = ${hid} `);
    if (activity && activity !== '') str = str.concat(`and NOTIFICATION_TYPE = '${activity}' `);

    let sql = `select HOUSE_ID,
                      TENANT_ID,
                      to_char(TIME, 'DD-MON-YYYY')                       as NOTIFICATION_TIME,
                      NOTIFICATION_TYPE,
                      (select USERNAME from PERSON where ID = TENANT_ID) as TENANT_NAME
               from NOTIFICATION
               where HOUSE_ID in (select HOUSE_ID
                                  from HOUSE
                                  where OWNER_ID = :owner_id)
                   ${str}
               order by "TIME" desc`;

    const res = await database.execute(sql, {owner_id: owner_id});
    return res.rows;
}

async function db_getNotification_tenant(tenant_id) {
    let sql = `select HOUSE_ID,
                      TENANT_ID,
                      ACTIVITY_ID,
                      to_char(TIME, 'DD-MON-YYYY')                       as NOTIFICATION_TIME,
                      NOTIFICATION_TYPE,
                      (select USERNAME from PERSON where ID = TENANT_ID) as TENANT_NAME
               from NOTIFICATION
               where TENANT_ID = :tenant_id
               order by NOTIFICATION_TIME desc`;
    const res = await database.execute(sql, {tenant_id: tenant_id});
    return res.rows;
}

module.exports = {
    db_getNotification_owner, db_getNotification_tenant
}