var express = require('express');
var router = express.Router();
var Categories = require('../models/categories');
var apiKey = require('../config/auth');

// No result handler
function handleEntityNotFound(res) {
  return function (entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

// Response handler
function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function (entity) {
    if (entity) {
      return res.status(statusCode).json(entity);
    }
    return null;
  };
}

// Error handler
function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function (err) {
    res.status(statusCode).send(err);
  };
}

// Get all entries
router.get('/', function (req, res) {
  Categories.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
  // var apiKey = req.query.apiKey;
  // var name = req.query.name;
  // var q = {
  //   active: true
  // };
  // if (name) {
  //   q = {
  //     active: true,
  //     name: name
  //   };
  // }
  // if (apiKey === 'this_is_my_token') {
  //   // Categories.find(q).exec()
  //   // .then(respondWithResult(res))
  //   // .catch(handleError(res));
  //   Categories.find(q).exec(function (err, data) {
  //     if (err) res.sendStatus(403);
  //     res.send(data.map(x => {
  //       return {
  //         CategoryName: x.name,
  //         Budget: x.budget,
  //       };
  //     }));
  //   });
  // } else {
  //   res.status(403).send('Unauthorized Access');
  // }
});

router.get('/:userId', function (req, res) {
  Categories.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
});

// Get an entry by Id
router.get('/:id', function (req, res) {
  Categories.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
});

// Create new entry
router.post('/', function (req, res) {
  Categories.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
  console.log(req.body);
});

// Update existing entry
router.put('/:id', function (req, res) {
  if (req.body._id) {
    Reflect.defineProperty(req.body, '_id');
  }
  Categories.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true,
    runValidators: true
  }).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
});

// Delete an existing entry
router.delete('/:id', function (req, res) {
  if (req.body._id) {
    Reflect.defineProperty(req.body, '_id');
  }
  Categories.findByIdAndRemove(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
});

module.exports = router;