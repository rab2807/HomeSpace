const express = require('express');
const profileController = require('./tenant.profile.controller');
const searchController = require('./tenant.search.controller')
const activityController = require("./tenant.activity.controller");
const historyController = require("./tenant.history.controller");

const router = express.Router();

//profile
router.get('/tenant/profile/:viewer?', profileController.renderPage);
router.post('/tenant/profile', profileController.postComment);

//search
router.get('/tenant/search/', searchController.renderPage);

//activities
// router.get('/tenant/activities', activityController.renderPage);
// router.post('/tenant/activities', activityController.postHandler);
//
// //history
// router.get('/tenant/history', historyController.renderPage);
// router.post('/tenant/history', historyController.postHandler);

module.exports = router;