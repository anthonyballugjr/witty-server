var express = require('express');
var router = express.Router();

var eController = require('./expenses.controller');
var sController = require('./savings.controller');
var auth = require('../../services/auth/jwt');

//EXPENSES
//create budget with ML
router.get('/next/:userId', auth.optional, eController.getNext);
router.get('/predict/:userId', auth.optional, eController.predict);
//CRUD
router.get('/expenses', auth.optional, eController.getEntries);
router.get('/expenses/user/:userId', auth.required, eController.getMyWallets);
router.post('/expenses', auth.required, eController.create);
router.put('/expenses/:id', auth.required, eController.update);
router.delete('/expenses/:id', auth.required, eController.destroy);
//reports
router.get('/expenses/overview/:userId', auth.required, eController.overview);

//SAVINGS
router.get('/savings', auth.optional, sController.getEntries);
router.get('/savings/user/:userId', auth.required, sController.getMySavings);
router.post('/savings', auth.required, sController.create);
router.put('/savings/:id', auth.required, sController.update);
router.delete('/savings/:id', auth.required, sController.destroy);
//reports
router.get('/savings/overview/:userId', auth.required, sController.overview);


module.exports = router;

