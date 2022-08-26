const express = require('express');
const loginController = require('./login.controller');
const logoutController = require('./logout.controller');

const router = express.Router();

router.get('/login', loginController.renderPage);
router.post('/login', loginController.postHandler);

router.get('/logout', logoutController.renderPage)

module.exports = router;