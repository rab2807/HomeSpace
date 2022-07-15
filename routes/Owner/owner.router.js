const express = require('express');
const profileController = require('./owner.profile.controller');
const houseController = require('./owner.house.controller')

const router = express.Router();

router.get('/owner/profile/:viewer?', profileController.renderPage);
router.post('/owner/profile', profileController.postComment);

router.get('/owner/house/:viewer?', houseController.renderPage);

module.exports = router;