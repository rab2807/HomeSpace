const database = require('../Database/database');
const {getLocation} = require('../helpers/locationUtil');

// house form input for '/house/form'
async function db_houseForm(req, id) {
    const location = await getLocation(req.lat, req.lon);

    let binds = {
        owner_id: id,
        name: req.name,
        location_id: location.id,
        created: req.created,
        price: req.price,
        vacant: 'yes',
        floor: req.floor,
        bedroom: req.bedroom,
        bathroom: req.bathroom,
        space: req.space,
        garage: req.garage,
        elevator: req.elevator,
        note: req.note,
    };

    let sql = `insert into house(owner_id, name, location_id, created, price, vacant, floor, bedroom, bathroom,
                                 elevator, garage, space, note)
               values (:owner_id, :name, :location_id, TO_DATE(:created, 'yyyy-mm-dd'), :price, :vacant, :floor,
                       :bedroom, :bathroom, :elevator, :garage, :space, :note)`;
    await database.execute(sql, binds);

    sql = `begin ADD_LOCATION(:lid, :lat, :lon, :area, :suburb, :district); end;`;
    binds = {
        lid: location.id,
        lat: req.lat,
        lon: req.lon,
        area: location.area,
        suburb: location.suburb,
        district: location.district,
    }
    await database.execute(sql, binds);
    console.log('house regi done');
}

// get house details
async function db_getHouseDetails(house_id) {
    let sql = `select H.HOUSE_ID,
                      OWNER_ID,
                      (select USERNAME from PERSON where ID = OWNER_ID)  as OWNER_NAME,
                      CREATED,
                      PROFILE_PICTURE,
                      PRICE,
                      VACANT,
                      FLOOR,
                      BEDROOM,
                      BATHROOM,
                      ELEVATOR,
                      GARAGE,
                      NOTE,
                      NAME,
                      SPACE,
                      LATITUDE,
                      LONGITUDE,
                      AREA,
                      SUBURB,
                      DISTRICT,
                      TENANT_ID,
                      (select USERNAME from PERSON where ID = TENANT_ID) as TENANT_NAME
               from HOUSE H
                        join LOCATION L on H.LOCATION_ID = L.LOCATION_ID
                        left join TENANT T on H.HOUSE_ID = T.HOUSE_ID
               where H.HOUSE_ID = :id`;
    let binds = {id: house_id};

    const res = await database.execute(sql, binds);
    return res.rows[0];
}

// get house details for '/house/:id'
async function db_getHouseRating(id) {
    let sql = `select *
               from GET_RATING(:id, 'house')`;
    const res1 = await database.execute(sql, {id: id});

    sql = `begin :ret := GET_AVG_RATING(:id, 'house'); end;`
    let binds = {
        id: id, ret: {dir: oracledb.BIND_OUT, type: oracledb.NUMBER}
    }
    const res2 = await database.execute(sql, binds);

    let arr = [{RATING: 5, COUNT: 0}, {RATING: 4, COUNT: 0}, {RATING: 3, COUNT: 0}, {RATING: 2, COUNT: 0}, {
        RATING: 1,
        COUNT: 0
    },];
    if (res1.rows.length !== 0) arr = res1.rows;

    return {
        arr: arr, avg: res2.outBinds.ret,
    }
}

// get house list of an owner for '/house/list/:owner_id'
async function db_getHousesFromPerson(id, sort = 'RATING', order = 'DESC') {
    let sql = `select HOUSE_ID,
                      PROFILE_PICTURE,
                      OWNER_ID,
                      AREA,
                      SUBURB,
                      DISTRICT,
                      PRICE,
                      VACANT,
                      GET_AVG_RATING(HOUSE_ID, 'house') as RATING
               from house h
                        join location l on h.LOCATION_ID = l.LOCATION_ID
               where h.OWNER_ID = :id
               order by ${sort} ${order}`;
    let binds = {id: id};
    return (await database.execute(sql, binds)).rows;
}

// get house follow/request list for '/house/:id'
async function db_getHouseActivity(id, type) {
    let table = (type === 'request') ? 'REQUEST' : 'FOLLOW';

    let sql = `select HOUSE_ID,
                      TENANT_ID,
                      to_char(${table}_TIME, 'DD-MON-YYYY')              as ${table}_TIME,
                      (select USERNAME from PERSON where ID = TENANT_ID) as TENANT_NAME
               from ${table}
               where HOUSE_ID = :id`;
    let res = await database.execute(sql, {id: id});
    // console.log(res.rows);
    return res.rows;
}

// get house pictures
async function db_getPictures(id) {
    let sql = `select PICTURE
               from HOUSE_PICTURE
               where HOUSE_ID = :id`
    const res = await database.execute(sql, {id: id});
    return res.rows;
}

// update house values
async function db_editHouseInfo(hid, house) {
    console.log(house);
    let sql = `update HOUSE
               set PRICE    =:price,
                   FLOOR    =:floor,
                   BEDROOM  =:bedroom,
                   BATHROOM =:bathroom,
                   ELEVATOR =:elevator,
                   GARAGE   =:garage,
                   NAME     =:name,
                   NOTE     =:note,
                   SPACE    =:space
               where HOUSE_ID = :hid`;
    let binds = {
        hid: hid,
        price: house.price,
        floor: house.floor,
        bathroom: house.bathroom,
        bedroom: house.bedroom,
        elevator: house.elevator,
        garage: house.garage,
        name: house.name,
        note: house.note,
        space: house.space
    }
    await database.execute(sql, binds);
}

// update house profile picture
async function db_updateProPic(id, file) {
    let sql = `update HOUSE
               set PROFILE_PICTURE = :fileName
               where HOUSE_ID = :id`;
    await database.execute(sql, {id: id, fileName: file});
}

// insert house pictures
async function db_uploadPictures(id, files) {
    for (let i = 0; i < files.length; i++) {
        let sql = `insert into HOUSE_PICTURE
                   values (:id, '${files[i]}')`;
        await database.execute(sql, {id: id});
    }
}

module.exports = {
    db_houseForm,
    db_getHouseRating,
    db_getHousesFromPerson,
    db_getHouseDetails,
    db_getHouseActivity,
    db_editHouseInfo,
    db_uploadPictures,
    db_updateProPic,
    db_getPictures
}