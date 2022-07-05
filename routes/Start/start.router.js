const express = require('express');
const con = require('./start.controller');

const router = express.Router();

router.get('/', con.renderPage);

module.exports = router;