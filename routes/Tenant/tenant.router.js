const express = require('express');
const profileController = require('./tenant.profile.controller');
const searchController = require('./tenant.search.controller')
const dashboardController = require("./tenant.dashboard.controller");
const maintenanceController = require("./tenant.maintenance.controller");
const editController = require("./tenant.edit.controller");
const reviewController = require("./tenant.review.controller");

const router = express.Router();

//profile
router.get('/tenant/profile/:id?', profileController.renderPage);

//search
router.get('/tenant/search/', searchController.renderPage);

//activities
router.get('/tenant/dashboard/', dashboardController.renderPage);

// maintenance
router.get('/tenant/maintenance', maintenanceController.renderPage);
router.post('/tenant/maintenance', maintenanceController.postHandler);

// edit profile
router.get('/tenant/edit', editController.renderPage);
router.post('/tenant/edit', editController.postHandler);

// review
router.post('/tenant/postReview', reviewController.postHandler);
module.exports = router;