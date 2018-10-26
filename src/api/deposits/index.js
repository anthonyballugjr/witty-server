var express = require('express');
var router = express.Router();

var controller = require('./deposits.controller');
var auth = require('../../services/auth/jwt');


router.get('/', auth.required, controller.getEntries);
router.get('/:id', auth.optional, controller.getEntry);
router.post('/', auth.required, controller.create);
router.put('/:id', auth.required, controller.update);
router.delete('/:id', auth.required, controller.destroy);

module.exports = router;