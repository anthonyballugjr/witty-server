var express = require('express');
var router = express.Router();

var controller = require('./categories.controller');
var auth = require('../../services/auth/jwt');

// ROUTES
// GET: api/categories/
// GET: api/categories/:id
// POST: api/categories/
// PUT: api/categories/:id
// DELETE: api/categories/:id

router.get('/', auth.optional, controller.getEntries);
router.get('/:id', auth.optional, controller.getEntry);
router.post('/', auth.required, controller.create);
router.put('/:id', auth.required, controller.update);
router.delete('/:id', auth.required, controller.destroy);

module.exports = router;