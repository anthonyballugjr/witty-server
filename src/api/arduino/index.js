var express = require('express');
var router = express.Router();

var controller = require('./controller');

// ROUTES
// GET: api/main/

router.get('/', controller.home);
router.post('/', controller.postData); 
router.get('/getData', controller.feed); 
// router.put('/:id', controller.update);
// router.delete('/:id', controller.destroy); 

module.exports = router;