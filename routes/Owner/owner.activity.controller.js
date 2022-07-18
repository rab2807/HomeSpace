const {request} = require("express");
let notiArr = [
    {
        name: "Kuddus",
        time: "21 Jan 2020",
        type: "request",
        house: "XE235235"
    },
    {
        name: "Kuddus",
        time: "21 Jan 2020",
        type: "leave",
        house: "XE235235"
    },
    {
        name: "Kuddus",
        time: "21 Jan 2020",
        type: "accept",
        house: "XE235235"
    },
    {
        name: "Kuddus",
        time: "21 Jan 2020",
        type: "request",
        house: "XE235235"
    },
    {
        name: "Kuddus",
        time: "21 Jan 2020",
        type: "leave",
        house: "XE235235"
    },
    {
        name: "Kuddus",
        time: "21 Jan 2020",
        type: "accept",
        house: "XE235235"
    },
];
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
    return res.render('activity', {
        notification: notiArr,
        house: houseArr,
        history: historyArr,
    });
}

function postHandler(req, res) {

}

module.exports = {
    renderPage, postHandler
}
