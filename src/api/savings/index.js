var express = require('express');
var router = express.Router();

var controller = require('./savings.controller');
var auth = require('../../services/auth/jwt');


router.get('/', auth.optional, controller.getEntries);
router.get('/user/:userId', auth.required, controller.getMySavingss);
router.post('/', auth.required, controller.create);
router.put('/:id', auth.required, controller.update);
router.delete('/:id', auth.required, controller.destroy);
//reports
router.get('/overview/:userId', auth.required, controller.overview);

module.exports = router;