const express = require('express');
const {saveImage} = require('../../config/multer')
const {authMiddleware} = require('../../Database/authorization')

const profileController = require('./owner.profile.controller');
const dashboardController = require('./owner.dashboard.controller');
const billingController = require('./owner.billing.controller');
const maintenanceController = require('./owner.maintenance.controller');
const editController = require('./owner.edit.controller');
const inboxController = require('./owner.inbox.controller');

const router = express.Router();

// profile
router.get('/owner/profile/:id?', profileController.renderPage);
router.post('/owner/profile/upload', saveImage, profileController.postHandler);

// activities
router.get('/owner/dashboard', dashboardController.renderPage);

// maintenance
router.get('/owner/maintenance', maintenanceController.renderPage);
router.post('/owner/maintenance/post', maintenanceController.postHandler);

// billing
router.get('/owner/billing', billingController.renderPage);
router.post('/owner/billing/post', billingController.postHandler);

// message
router.get('/owner/inbox', inboxController.renderPage);

// edit profile
router.get('/owner/edit', editController.renderPage);
router.post('/owner/edit', editController.postHandler);

module.exports = router;