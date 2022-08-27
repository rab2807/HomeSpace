const express = require('express');
const {saveImage} = require('../../config/multer')

const profileController = require('./tenant.profile.controller');
const searchController = require('./tenant.search.controller')
const dashboardController = require("./tenant.dashboard.controller");
const maintenanceController = require("./tenant.maintenance.controller");
const billingController = require("./tenant.billing.controller");
const historyController = require('./tenant.history.controller');
const editController = require("./tenant.edit.controller");
const reviewController = require("./tenant.review.controller");
const inboxController = require("./tenant.inbox.controller");

const router = express.Router();

//profile
router.get('/tenant/profile/:id?', profileController.renderPage);
router.post('/tenant/profile/upload', saveImage, profileController.postHandler);

//search
router.get('/tenant/search/', searchController.renderPage);

//activities
router.get('/tenant/dashboard/', dashboardController.renderPage);

// maintenance
router.get('/tenant/maintenance', maintenanceController.renderPage);
router.post('/tenant/maintenance/post', maintenanceController.postHandler);

// billing
router.get('/tenant/billing', billingController.renderPage);
router.post('/tenant/billing/post', billingController.postHandler);

// message
router.get('/tenant/inbox', inboxController.renderPage);

// edit profile
router.get('/tenant/edit', editController.renderPage);
router.post('/tenant/edit', editController.postHandler);

// history
router.get('/tenant/history', historyController.renderPage);

// review
router.post('/tenant/postReview', reviewController.postHandler);
module.exports = router;