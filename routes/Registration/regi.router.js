const express = require('express');
const con = require('./regi.controller');

const router = express.Router();

router.get('/regi/:userType', con.renderPage);

router.post('/regi/:userType', con.registerUser);

module.exports = router;