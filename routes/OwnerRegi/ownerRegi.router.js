const express = require('express');
const con = require('./ownerRegi.controller');

const router = express.Router();

router.get('/ownerRegi', con.renderPage);

module.exports = router;