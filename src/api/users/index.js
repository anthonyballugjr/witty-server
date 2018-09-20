var express = require('express');
var router = express.Router();

var controller = require('./users.controller');
var authentication = require('./users.authentication');
var auth = require('../../services/auth/jwt');

//authentication
router.post('/register', auth.optional, authentication.register); 
router.post('/login', auth.optional, authentication.login); 
router.get('/me', auth.required, authentication.me); 
router.get('/logout', authentication.logout);
router.put('changePassword/:id', auth.required, authentication.changePassword);
//controller
router.get('/', controller.getEntries);
router.get('/profile/:id', auth.required, controller.profile);
router.put('/:id', auth.required, controller.update);
router.delete('/:id', auth.optional, controller.destroy);

module.exports = router;