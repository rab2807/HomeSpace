let houseArr = [
    {
        name: "XE23523",
        location: "Dhaka, Bangladesh",
        rating: "3.7",
        price: 15000
    },
    {
        name: "DE92837",
        location: "Dhaka, Bangladesh",
        rating: "3.1",
        price: 15000
    },
    {
        name: "XE23523",
        location: "Dhaka, Bangladesh",
        rating: "4.7",
        price: 15000
    },
]


function renderPage(req, res) {
    return res.render('house-menu', {
        house: houseArr,
    });
}

function postHandler(req, res) {

}

module.exports = {
    renderPage, postHandler
}
