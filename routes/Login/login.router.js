const express = require('express');
const con = require('./login.controller');

const router = express.Router();

router.get('/login', con.renderPage);

router.post('/login', con.postHandler);

module.exports = router;