const express = require('express');
const profileController = require('./tenant.profile.controller');
const searchController = require('./tenant.search.controller')
const dashboardController = require("./tenant.dashboard.controller");
const maintenanceController = require("./tenant.maintenance.controller");

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

module.exports = router;