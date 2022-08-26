const database = require('../Database/database');

async function db_getInbox(id) {
    let sql = `select id,
                      (select USERNAME
                       from PERSON
                       where PERSON.ID = T.id) name
               from (
                        select RECEIVER_ID id
                        from MESSAGE
                        where SENDER_ID = :id
                        union
                        (select SENDER_ID id
                         from MESSAGE
                         where RECEIVER_ID = :id)
                    ) T`;
    const res = await database.execute(sql, {id: id});
    return res.rows;
}

async function db_getUnseenMessageCount(id1, id2) {
    let sql = `select count(*) CNT
               from MESSAGE
               where SEEN = 'no'
                 and ((SENDER_ID = :id1 and RECEIVER_ID = :id2)
                   or (SENDER_ID = :id2 and RECEIVER_ID = :id1))`;
    const res = await database.execute(sql, {id1: id1, id2: id2});
    return res.rows[0].CNT;
}

async function db_getMessages(id1, id2) {
    let sql = `select SENDER_ID                                            id1,
                      (select USERNAME from PERSON where ID = SENDER_ID)   name1,
                      RECEIVER_ID                                          id2,
                      (select USERNAME from PERSON where ID = RECEIVER_ID) name2,
                      to_char(time, 'DD-MON-YYYY, MM:HH AM') as            message_time,
                      statement
               from MESSAGE
               where (SENDER_ID = :id1 and RECEIVER_ID = :id2)
                  or (RECEIVER_ID = :id1 and SENDER_ID = :id2)
               order by "TIME" asc`;
    const res = await database.execute(sql, {id1: id1, id2: id2});
    return res.rows;
}

async function db_postMessage(id1, id2, msg) {
    let sql = `insert into MESSAGE(SENDER_ID, RECEIVER_ID, statement)
               values (:id1, :id2, :msg)`;
    let binds = {id1: id1, id2: id2, msg: msg};
    await database.execute(sql, binds);
}

async function db_seenZoneMessage(id1, id2) {
    let sql = `update MESSAGE
               set SEEN = 'yes'
               where SEEN = 'no'
                 and ((SENDER_ID = :id1 and RECEIVER_ID = :id2)
                   or (SENDER_ID = :id2 and RECEIVER_ID = :id1))`;
    let binds = {id1: id1, id2: id2};
    await database.execute(sql, binds);
}

module.exports = {
    db_getMessages, db_getInbox, db_postMessage, db_seenZoneMessage, db_getUnseenMessageCount
}