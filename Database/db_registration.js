const database = require("./database");
const {getLocation} = require('../helpers/locationUtil');

async function db_registration(response) {
    const x = response.lat;
    const y = response.lon;
    let location = await getLocation(x, y);
    // console.log(response);

    let binds = {
        name: response.username,
        pass: response.password,
        phone: response.phone,
        mail: response.email,
        lid: location.id,
        lat: response.lat,
        lon: response.lon,
        area: location.area,
        suburb: location.suburb,
        district: location.district,
    };

    console.log(binds);
    // begin add_user('Modon', 'hdfdjfhjd', '01744956510', 'iudgidd@gmail.com', 87346587, 23.7441269, 90.4222081, '56 no road', 'Shahidbagh', 'Dhaka District', 'owner', category_=>'Real Estate Agency'); end;
    let sql;
    if (response.category) {
        sql = `begin ADD_USER(:name, :pass, :phone, :mail, :lid, :lat, :lon, :area, :suburb, :district, 'owner', category_=>:category); end;`;
        binds['category'] = response.category;
    } else if (response.job) {
        sql = `begin ADD_USER(:name, :pass, :phone, :mail, :lid, :lat, :lon, :area, :suburb, :district, 'tenant', job_=>:job, hid=>:home_id, members=>:mem); end;`;
        binds['job'] = response.job;
        binds['home_id'] = response.home_id;
        binds['mem'] = response.member;
    }
    await database.execute(sql, binds);
}

module.exports = {
    db_registration
}
