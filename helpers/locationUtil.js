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

module.exports = {
    getLocation
}