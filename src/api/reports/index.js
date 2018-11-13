var express = require('express');
var router = express.Router();

var controller = require('./reports.controller');
var auth = require('../../services/auth/jwt');

router.get('/budgetProfile/:userId', auth.required, controller.budgetProfile);
router.get('/overview/:userId', auth.required, controller.overview);



module.exports = router;