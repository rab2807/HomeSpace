const express = require('express');
const {authMiddleware} = require('../../Database/authorization')

const profileController = require('./owner.profile.controller');
const dashboardController = require('./owner.dashboard.controller');
const historyController = require('./owner.history.controller');
const maintenanceController = require('./owner.maintenance.controller');

const router = express.Router();

// profile
router.get('/owner/profile/:id?', profileController.renderPage);

// activities
router.get('/owner/dashboard', dashboardController.renderPage);

// maintenance
router.get('/owner/maintenance', maintenanceController.renderPage);
router.post('/owner/maintenance', maintenanceController.postHandler);

//history
router.get('/owner/history', authMiddleware, historyController.renderPage);
router.post('/owner/history', historyController.postHandler);

module.exports = router;