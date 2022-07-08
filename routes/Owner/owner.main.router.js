const express = require('express');
const profileController = require('./owner.profile.controller');
const houseController = require('./owner.house.controller')

const router = express.Router();

router.get('/owner/main/:viewer?', profileController.renderPage);
router.post('/owner/main', profileController.postComment);

router.get('/owner/house/:viewer?', houseController.renderPage);

module.exports = router;