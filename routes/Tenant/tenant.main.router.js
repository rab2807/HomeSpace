const express = require('express');
const profileController = require('./tenant.profile.controller');
const searchController = require('./tenant.search.controller')

const router = express.Router();

router.get('/tenant/profile/:viewer?', profileController.renderPage);
router.post('/tenant/profile', profileController.postComment);

router.get('/tenant/search/', searchController.renderPage);

module.exports = router;