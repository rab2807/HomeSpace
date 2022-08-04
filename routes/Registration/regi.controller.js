const database = require('../../Database/database');
const axios = require("axios");

async function getLocation(x, y) {
    let res = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${x}&lon=${y}&zoom=16&addressdetails=1&accept-language=en`);
    res = await res.data;

    return {
        id: res['place_id'],
        area: String(res['display_name']).split(',')[0],
        suburb: res['address']['suburb'],
        district: res['address']['state_district'],
    }
}

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

function renderPage(req, res) {
    const type = req.params['userType'];
    if (type === 'owner' || type === 'tenant')
        return res.render('regi', {
            layout: 'layout2',
            pre: 'Registration',
            type: req.params['userType'],
            cndtn: req.params['userType'] === 'owner',
        });
    else return res.status(400).send({
        message: 'This is an error!'
    });
}

async function registerUser(req, res) {
    // a procedure to add in user, then owner table : returns owner id;
    // for error returns errorCode;
    const response = req.body;
    const error = db_registration(response);
    if (error.message) {
        console.log(error.message);
        res.redirect('/regi/' + (response.category ? 'owner' : 'tenant'));
        return;
    }
    res.redirect('/login');
}

module.exports = {
    renderPage, registerUser,
}