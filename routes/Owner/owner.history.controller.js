let houseArr = [
    {
        name: "XR7254",
        id: 8273427
    },
    {
        name: "XR7674",
        id: 82735327
    }
];
let historyArr = [
    {
        name: "XR7254",
        tenant: "Rakib Ahsan",
        join_date: "21 July 1998",
        leave_date: "21 July 2001",
        duration: "24 months"
    }
]
function renderPage(req, res) {
    return res.render('activities', {
        house: houseArr,
        history: historyArr,
    });
}

function postHandler(req, res) {

}

module.exports = {
    renderPage, postHandler
}
