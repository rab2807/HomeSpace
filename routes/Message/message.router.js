const express = require('express');
const con = require('./message.controller');

const router = express.Router();

router.get('/message/:id1/:id2', con.renderPage);
router.post('/message/:id1/:id2/post', con.postHandler);

module.exports = router;