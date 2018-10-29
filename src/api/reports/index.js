var express = require('express');
var router = express.Router();

var controller = require('./reports.controller');
var auth = require('../../services/auth/jwt');

router.get('/budgetProfile/:id', auth.required, controller.budgetProfile);



module.exports = router;