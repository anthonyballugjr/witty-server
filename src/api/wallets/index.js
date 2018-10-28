var express = require('express');
var router = express.Router();

var controller = require('./wallets.controller');
var auth = require('../../services/auth/jwt');

//create budget with ML
router.get('/next/:userId', auth.optional, controller.getNext);
router.get('/predict/:userId', auth.optional, controller.predict);
//CRUD
router.get('/', auth.optional, controller.getEntries);
router.get('/user/:userId', auth.required, controller.getMyWallets);
router.get('/savings', auth.optional, controller.getSavings);
router.post('/', auth.required, controller.create);
router.put('/:id', auth.required, controller.update);
router.delete('/:id', auth.required, controller.destroy);
//reports
router.get('/overview/:userId', auth.required, controller.overview);
module.exports = router;