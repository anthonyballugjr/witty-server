var express = require('express');
var router = express.Router();

var controller = require('./users.controller');
var auth = require('../../services/auth/jwt');

router.post('/register', auth.optional, controller.register); 
router.post('/login', auth.optional, controller.login); 
router.get('/me', auth.required, controller.me); 

module.exports = router;