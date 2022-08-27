const express = require('express');
const con = require('./regi.controller');

const router = express.Router();

router.get('/regi/:userType/:error?', con.renderPage);

router.post('/regi/post', con.registerUser);

module.exports = router;