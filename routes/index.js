var express = require('express');
var router = express.Router();
var Categories = require('../models/categories');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Trial' });
});

router.get('/view', function (req, res) {
  var t = req.query.name;
  Categories.find({name: t}).exec(function (err, data) {
    if (err) res.sendStatus(500);
    res.send(data);
  });
});

module.exports = router;
