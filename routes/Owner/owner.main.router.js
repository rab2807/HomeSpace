const express = require('express');
const con = require('./owner.main.controller');

const router = express.Router();

router.get('/owner/main/:viewer?', con.renderPage);
router.post('/owner/main', con.postComment);

module.exports = router;