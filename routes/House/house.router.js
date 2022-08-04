const express = require('express');
const detailsController = require('./house.details.controller');
const formController = require('./house.form.controller')

const router = express.Router();

router.get('/house/details/:id?', detailsController.renderPage);

router.get('/house/form/', formController.renderPage);
router.post('/house/form/:ownerId?', formController.postForm);

module.exports = router;