const database = require('../Database/database');

async function db_getExpectedRevenue(owner_id) {
    let sql = `select nvl(sum(PRICE), 0) as sum
               from HOUSE
               where OWNER_ID = :owner_id
                 and VACANT = 'yes'`

    const res = await database.execute(sql, {owner_id: owner_id});
    return res.rows[0].SUM;
}

async function db_getGainedRevenue(owner_id, month, year) {
    let sql = `select nvl(sum(PRICE), 0) as sum
               from HOUSE H
                        join BILLING B on H.HOUSE_ID = B.HOUSE_ID
               where OWNER_ID = :owner_id
                 and MONTH = :month
                 and YEAR = :year
                 and STATUS = 'clear'`;

    let binds = {owner_id: owner_id, month: month, year: year};
    const res = await database.execute(sql, binds);
    return res.rows[0].SUM;
}

async function db_getPreviousDues(owner_id, month, year) {
    let sql = `select nvl(sum(PRICE), 0) as sum
               from HOUSE H
                        join BILLING B on H.HOUSE_ID = B.HOUSE_ID
               where OWNER_ID = :owner_id
                 and ((MONTH = :month and YEAR < :year) or (MONTH < :month and YEAR = :year))
                 and STATUS = 'due'`;

    let binds = {owner_id: owner_id, month: month, year: year};
    const res = await database.execute(sql, binds);
    return res.rows[0].SUM;
}

async function db_getExpense(owner_id, month, year) {
    let sql = `select nvl(sum(COST), 0) as sum
               from MAINTENANCE
               where RESOLVED = 'yes'
                 and HOUSE_ID in (select HOUSE_ID
                                  from HOUSE
                                  where OWNER_ID = :owner_id)
                 and TO_NUMBER(TO_CHAR(MAINTENANCE_TIME, 'MM')) = :month
                 and TO_NUMBER(TO_CHAR(MAINTENANCE_TIME, 'YYYY')) = :year`

    let binds = {owner_id: owner_id, month: month, year: year};
    const res = await database.execute(sql, binds);
    return res.rows[0].SUM;
}

async function db_getBillingHistory(owner_id) {
    let sql = `select HOUSE_ID,
                      TENANT_ID,
                      MONTH,
                      YEAR,
                      PAID,
                      STATUS,
                      (select USERNAME from PERSON where ID = TENANT_ID) as TENANT_NAME
               from BILLING
               where HOUSE_ID IN (select HOUSE_ID
                                  from HOUSE
                                  where OWNER_ID = :owner_id)
               order by YEAR, MONTH desc`;

    const res = await database.execute(sql, {owner_id: owner_id});
    return res.rows;
}

async function db_getBillingInfo(id) {
    let sql = `select *
               from BILLING
               where BILLING_ID = :id`;
    const res = await database.execute(sql, {id: id});
    return res.rows[0];
}

async function db_getMaintenanceHistory(id, flag) {
    let sql = '';
    if (flag == 'owner')
        sql = `select *
               from MAINTENANCE
               where HOUSE_ID IN (select HOUSE_ID
                                  from HOUSE
                                  where OWNER_ID = :id)
               order by MAINTENANCE_TIME desc`;
    else
        sql = `select *
               from MAINTENANCE
               where HOUSE_ID IN (select HOUSE_ID
                                  from HOUSE
                                  where TENANT_ID = :id)
               order by MAINTENANCE_TIME desc`;

    const res = await database.execute(sql, {id: id});
    return res.rows;
}

async function db_loadCurrentMonth(owner_id, month, year) {
    let sql = `
        DECLARE
            num number;
        begin
            select count(*)
            into num
            from BILLING
            where HOUSE_ID IN (select HOUSE_ID
                               from HOUSE
                               where OWNER_ID = :owner_id)
              and MONTH = :month
              and YEAR = :year;
            
            if num = 0 then
                insert into BILLING(house_id, tenant_id, month, year, paid, status)
                select H.HOUSE_ID, TENANT_ID, :month, :year, PRICE, 'due'
                from HOUSE H
                         join TENANT T on H.HOUSE_ID = T.HOUSE_ID
                where H.HOUSE_ID IN (select HOUSE_ID
                                     from HOUSE
                                     where OWNER_ID = :owner_id)
                  and VACANT = 'no';
            end if;
        end;
        `;

    let binds = {owner_id: owner_id, month: month, year: year};
    await database.execute(sql, binds);
}

async function db_resolveMaintenance(id, cost) {
    let sql = `update maintenance
               set COST     = :cost,
                   RESOLVED = 'yes'
               where MAINTENANCE_ID = :id`;
    await database.execute(sql, {id: id, cost: cost});

    sql = `insert into NOTIFICATION(house_id, tenant_id, activity_id, notification_type)
           select house_id, tenant_id, activity_id, 'maintenance-resolve'
           from NOTIFICATION
           where ACTIVITY_ID = :id`;
    await database.execute(sql, {id: id});
}

async function db_postMaintenance(tid, category, details) {
    let sql = `insert into MAINTENANCE(house_id, tenant_id, category, details, resolved)
               values ((select HOUSE_ID from TENANT where TENANT_ID = :tid), :tid, :category, :details, 'no')`;
    let binds = {tid: tid, category: category, details: details}
    await database.execute(sql, binds);
}

async function db_resolveBilling(tid, month, year) {
    let sql = `update BILLING
               set PAID   = (
                   select PRICE
                   from HOUSE
                            join TENANT on HOUSE.HOUSE_ID = TENANT.HOUSE_ID
                   where TENANT_ID = :tid),
                   STATUS = 'cleared'
               where TENANT_ID = :tid
                 and MONTH = :month
                 and YEAR = :year`;
    let binds = {tid: tid, month: month, year: year}
    await database.execute(sql, binds);

    sql = `insert into NOTIFICATION(house_id, tenant_id, activity_id, notification_type)
           select HOUSE_ID, TENANT_ID, BILLING_ID, 'billing-resolve'
           from BILLING
           where TENANT_ID = :tid
             and MONTH = :month
             and YEAR = :year`;
    binds = {tid: tid, month: month, year: year}
    await database.execute(sql, binds);

}

async function db_getUnpaidBillList(tid, month, year) {
    let sql = `select *
               from BILLING
               where TENANT_ID = :tid
                 and MONTH = :month
                 and YEAR = :year
                 and STATUS = 'due'
               order by YEAR, MONTH desc`;
    let binds = {tid: tid, month: month, year: year}
    return (await database.execute(sql, binds)).rows;
}

module.exports = {
    db_getMaintenanceHistory,
    db_getExpectedRevenue,
    db_getGainedRevenue,
    db_getBillingHistory,
    db_getPreviousDues,
    db_getExpense,
    db_loadCurrentMonth,
    db_resolveMaintenance,
    db_postMaintenance, db_resolveBilling, db_getUnpaidBillList, db_getBillingInfo
}