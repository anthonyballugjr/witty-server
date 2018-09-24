var express = require('express');
var router = express.Router();

var controller = require('./archives.controller');
var auth = require('../../services/auth/jwt');

router.get('/', auth.required, controller.getEntries);
router.get('/:id', auth.required, controller.getEntry);
router.get('/overview/:user', auth.optional, controller.getOverview);
router.post('/', auth.required, controller.create);

module.exports = router;