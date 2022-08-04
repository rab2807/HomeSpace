const database = require('../../Database/database');

const imageArr = [0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3];
const house = {
    name: "XE3654",
    altName: "Nuhash Polli",
    ownerName: "Kuddus",
    rating: [34, 43, 12, 8, 20],
    ownerID: 12412523124,
    location: "Dhaka, Bangladesh",
    bedroom: 2,
    bathroom: 2,
    space: 1400,
    floor: 5,
    members: 3,
    garage: true,
    elevator: false,
    note: "Load shedding occurs very much"
}

let commentArr = [
    {
        // picture link should be added
        name: "Rakib",
        post_date: "21 July 2020",
        star: "⭐⭐⭐",
        comment: "bal sal",
    },
    {
        name: "Ahsan",
        post_date: "21 Feb 2020",
        star: "⭐⭐⭐⭐",
        comment: "bal sal",
    }
]


function renderPage(req, res) {
    res.render('house-details', {
        images: imageArr,
        house: house,
        // action: '/'
        comments: commentArr,
        ratingArr: house.rating,
        rating: () => {
            let sum = 0;
            for (let i = 0; i < 5; i++)
                sum += (5 - i) * house.rating[i];
            return (sum / house.rating.reduce((t, n) => t += n, 0)).toFixed(2);
        }
    });
}

module.exports = {
    renderPage,
}