const express = require('express');
const detailsController = require('./house.details.controller');
const formController = require('./house.form.controller');
const listController = require('./house.list.controller');
const requestController = require('./house.request.controller');
const activityController = require('./house.activity.controller');
const editController = require('./house.edit.controller');

const router = express.Router();

router.get('/house/form', formController.renderPage);
router.post('/house/form', formController.postForm);

router.get('/house/edit/:hid', editController.renderPage);
router.post('/house/edit/:hid', editController.postHandler);

router.get('/house/:house_id', detailsController.renderPage);

router.get('/house/list/:owner_id', listController.renderPage);

router.get('/house/request/:hid/:action/:tid?', requestController.handler);

router.get('/house/activity/:hid', activityController.renderPage);


module.exports = router;