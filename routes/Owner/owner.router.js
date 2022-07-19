const express = require('express');
const profileController = require('./owner.profile.controller');
const houseController = require('./owner.house.controller');
const activityController = require('./owner.activity.controller');
const historyController = require('./owner.history.controller');

const router = express.Router();

// profile
router.get('/owner/profile/:viewer?', profileController.renderPage);
router.post('/owner/profile', profileController.postHandler);

// house
router.get('/owner/house/:viewer?', houseController.renderPage);
router.post('/owner/house', houseController.postHandler);

//activities
router.get('/owner/activities', activityController.renderPage);
router.post('/owner/activities', activityController.postHandler);

//history
router.get('/owner/history', historyController.renderPage);
router.post('/owner/history', historyController.postHandler);

module.exports = router;