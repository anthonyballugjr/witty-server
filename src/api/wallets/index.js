var express = require('express');
var router = express.Router();

var eController = require('./expenses.controller');
var sController = require('./savings.controller');
var auth = require('../../services/auth/jwt');

//EXPENSES
//create budget with ML
router.get('/expense/next/:userId', auth.optional, eController.getNext);
router.get('/expense/predict/:userId', auth.required, eController.predict);
//CRUD
router.get('/expense', auth.optional, eController.getEntries);
router.get('/expense/user/:userId', auth.required, eController.getMyWallets);
router.post('/expense', auth.required, eController.create);
router.put('/expense/:id', auth.required, eController.update);
router.delete('/expense/:id', auth.required, eController.destroy);
//reports
router.get('/expense/overview/:userId', auth.required, eController.overview);

//SAVINGS
router.get('/savings', auth.optional, sController.getEntries);
router.get('/savings/user/:userId', auth.required, sController.getMySavings);
router.post('/savings', auth.required, sController.create);
router.put('/savings/:id', auth.required, sController.update);
router.delete('/savings/:id', auth.required, sController.destroy);

router.get('/savings/overview/:userId', auth.required, sController.overview);

module.exports = router;

