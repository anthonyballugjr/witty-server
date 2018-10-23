var express = require('express');
var router = express.Router();

var controller = require('./users.controller');
var authentication = require('./users.authentication');
var auth = require('../../services/auth/jwt');

//authentication
router.post('/register', auth.optional, authentication.register); 
router.post('/login', auth.optional, authentication.login); 
router.get('/me', auth.required, authentication.me); 
router.put('/changePassword', auth.required, authentication.changePassword);
//controller
router.get('/', controller.getEntries);
router.get('/profile', auth.required, controller.profile);
router.put('/', auth.required, controller.update);
router.delete('/:id', auth.optional, controller.destroy);
//utility
router.get('/forgotPassword/:email', auth.optional, authentication.forgotPassword);
router.get('/resetPassword/:token', auth.optional, authentication.resetPassword);
router.get('/activate/:token', auth.optional, authentication.activate);
router.get('/logout', authentication.logout);


module.exports = router;