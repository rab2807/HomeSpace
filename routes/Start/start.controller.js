const axios = require('axios');

function renderPage(req, res) {
    return res.render('home', {
        pre: 'Shit!!',
        title: 'Cool, huh!',
        name: "rakib",
        condition: true,
        anyArray: [1, 2, 3],
        gotoOwnerRegi: async () => {
            console.log('blah');
            axios.get('http://localhost:3000/ownerRegi')
                .then(response => { console.log('burrppp') })
        }
    });
}

module.exports = {
    renderPage
}