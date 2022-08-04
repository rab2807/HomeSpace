const {extractToken} = require('../../Database/authorization');
const database = require('../../Database/database');

async function db_getPerson(id) {

    const binds = {id: id};
    const sql = `select ID,
                        USERNAME,
                        PASSWORD,
                        EMAIL,
                        PHONE,
                        AREA,
                        SUBURB,
                        DISTRICT,
                        CATEGORY
                 from PERSON P
                          join LOCATION L on P.LOCATION_ID = L.LOCATION_ID
                          join OWNER O on P.ID = O.OWNER_ID
                 where ID = :id`;
    const res = await database.execute(sql, binds);
    console.log(res.rows);
    return res.rows[0];
}

// return rating array of the houses owned by the owner
async function db_getRating_owner(id) {

}

// return an object with houseCount and tenantCount
async function db_getCount(id) {

}

//-------- Sakib's part------
let ratingArr = [10, 9, 3, 4, 1];    // count of people per star [e.g. 6 people gave 5stars]

// comments array
let commentArr = [
    {
        // picture link should be added
        name: "Rakib",
        post_date: "21 July 2020",
        star: 3,
        comment: "bal sal",
    },
    {
        name: "Ahsan",
        post_date: "21 Feb 2020",
        star: 4,
        comment: "bal sal",
    }
]
const house_num = 3;

//-------------------


async function renderPage(req, res) {
    let token = extractToken(req);
    const owner = await db_getPerson(token.id);
    console.log(owner);
    // console.log(owner);
    // const ratingArr = db_getRating_owner(token.id);

    return res.render('profile', {
        pre: owner.USERNAME + `'s Profile`,
        type: "Home-owner",
        name: owner.USERNAME,
        catagory: owner.CATEGORY,
        location: owner.AREA + ', ' + owner.SUBURB + ', ' + owner.DISTRICT,
        email: owner.EMAIL,
        phone: owner.PHONE,
        house_num: owner.HOUSE,

        rating: () => {
            let sum = 0;
            const total = ratingArr.reduce((curr, elem) => curr + elem, 0);
            for (let i = 0; i < 5; i++)
                sum += (5 - i) * ratingArr[i];
            return (sum / total).toFixed(2);
        },
        ratingArr: ratingArr,
        isOwner: true
    });
}

function postHandler(req, res) {
    // save in database

    res.send(req.body);
}

module.exports = {
    renderPage, postHandler
}
