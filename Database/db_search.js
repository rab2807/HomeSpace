const database = require("./database");

async function db_searchHouse(criteria) {
    let str = '';
    if (criteria.suburb !== '')
        str = str.concat(`and suburb like '%${criteria.suburb}%' `)
    if (criteria.district !== '')
        str = str.concat(`and district like '%${criteria.district}%' `)
    if (criteria.vacant !== '')
        str = str.concat(`and vacant = '${criteria.vacant}' `)
    if (criteria.rating_low !== '')
        str = str.concat(`and rating >= ${criteria.rating_low} `)
    if (criteria.rating_high !== '')
        str = str.concat(`and rating <= ${criteria.rating_low} `)
    if (criteria.price_low !== '')
        str = str.concat(`and price >= ${criteria.price_low} `)
    if (criteria.price_high !== '')
        str = str.concat(`and price <= ${criteria.price_high} `)
    if (criteria.space !== '')
        str = str.concat(`and space >= ${criteria.space} `)
    if (criteria.floor !== '')
        str = str.concat(`and floor = ${criteria.floor} `)
    if (criteria.bedroom !== '')
        str = str.concat(`and bedroom = ${criteria.bedroom} `)
    if (criteria.bathroom !== '')
        str = str.concat(`and bathroom = ${criteria.bathroom} `)
    if (criteria.sort !== '')
        str = str.concat(`order by ${criteria.sort} `)
    if (criteria.order !== '')
        str = str.concat(`${criteria.order} `)

    let sql = `select HOUSE_ID,
                      OWNER_ID,
                      PROFILE_PICTURE,
                      AREA,
                      SUBURB,
                      DISTRICT,
                      PRICE,
                      VACANT,
                      GET_AVG_RATING(HOUSE_ID, 'house') as RATING
               from house h
                        join location l on h.LOCATION_ID = l.LOCATION_ID
               where HOUSE_ID = HOUSE_ID ` + str;
    const res = await database.execute(sql, {});
    return res.rows;
}

module.exports = {
    db_searchHouse
}