var express = require('express');
var router = express.Router();
var Users = require('../models/users');

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
  Users.find().exec()
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
  //   // Users.find(q).exec()
  //   // .then(respondWithResult(res))
  //   // .catch(handleError(res));
  //   Users.find(q).exec(function (err, data) {
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

router.post('/login', function (req, res) {
  Users.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
  // var apiKey = req.query.apiKey;
  var email = req.query.email;
  var password = req.query.password;
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
  //   // Users.find(q).exec()
  //   // .then(respondWithResult(res))
  //   // .catch(handleError(res));
  //   Users.find(q).exec(function (err, data) {
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

// Get an entry by Id
router.get('/:id', function (req, res) {
  Users.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
});

// Create new entry
router.post('/', function (req, res) {
  Users.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
  console.log(req.body);
});

// Update existing entry
router.put('/:id', function (req, res) {
  if (req.body._id) {
    Reflect.defineProperty(req.body, '_id');
  }
  Users.findByIdAndUpdate(req.params.id, req.body, {
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
  Users.findByIdAndRemove(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
});

module.exports = router;
