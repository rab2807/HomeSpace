const database = require('../Database/database');
const {getLocation} = require('../helpers/locationUtil');

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
        minimum_stay: req.period,
        note: req.note,
    };
    console.log(binds);

    let sql = `insert into house(owner_id, name, location_id, created, price, vacant, floor, bedroom, bathroom,
                                 elevator, garage, minimum_stay, space, note)
               values (:owner_id, :name, :location_id, TO_DATE(:created,'yyyy-mm-dd'), :price, :vacant, :floor, :bedroom, :bathroom,
                       :elevator,
                       :garage, :minimum_stay, :space, :note)`;
    await database.execute(sql, binds);

    sql = `begin ADD_LOCATION(:id, :lat, :lon, :area, :suburb, :district); end;`;
    binds = {
        id: id,
        lat: req.lat,
        lon: req.lon,
        area: location.area,
        suburb: location.suburb,
        district: location.district
    }
    await database.execute(sql, binds);
    console.log('house regi done')
}

async function db_getHouseDetails(house_id) {
    let sql = `select *
               from HOUSE
               where HOUSE_ID = :id`;
    let binds = {id: house_id};

    const res = await database.execute(sql, binds);
    console.log('db_getHouseDetails:', res.rows[0]);
    return res;
}

module.exports = {
    db_houseForm, db_getHouseDetails
}