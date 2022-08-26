const express = require('express');
const detailsController = require('./house.details.controller');
const formController = require('./house.form.controller');
const listController = require('./house.list.controller');
const requestController = require('./house.request.controller');
const activityController = require('./house.activity.controller');
const editController = require('./house.edit.controller');
const reviewController = require('./house.review.controller');

const router = express.Router();

// house registration
router.get('/house/form', formController.renderPage);
router.post('/house/form', formController.postForm);

// house picture upload
router.post('/house/upload', detailsController.postHandler);

// house edit
router.get('/house/edit/:hid', editController.renderPage);
router.post('/house/edit/:hid', editController.postHandler);

// house profile
router.get('/house/:house_id', detailsController.renderPage);

// house list of an owner
router.get('/house/list/:owner_id', listController.renderPage);

// house request manager
router.get('/house/request/:hid/:action/:tid?', requestController.handler);

// house activity manager
router.get('/house/activity/:hid', activityController.renderPage);

// house activity manager
router.post('/house/postReview', reviewController.postHandler);

module.exports = router;