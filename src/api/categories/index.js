var express = require('express');
var router = express.Router();

var controller = require('./categories.controller');

// ROUTES
// GET: api/categories/
// GET: api/categories/:id
// POST: api/categories/
// PUT: api/categories/:id
// DELETE: api/categories/:id

router.get('/', controller.getEntries);
router.get('/:id', controller.getEntry);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;