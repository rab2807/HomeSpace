let houseArr = [
    {
        name: "XE23523",
        type: "family home",
        bedroom: 2,
        floor: 3,
        garage: true,
        price: 15000
    },
    {
        name: "DE92837",
        type: "family home",
        bedroom: 2,
        floor: 3,
        garage: true,
        price: 15000
    },
    {
        name: "XE23523",
        type: "family home",
        bedroom: "2",
        floor: 3,
        garage: true,
        price: 15000
    },
]

function renderPage(req, res) {
    return res.render('search', {
        house: houseArr,
    });
}

module.exports = {
    renderPage,
}
