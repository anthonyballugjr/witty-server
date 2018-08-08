var express = require('express');
var passport = require('passport');
var User = require('../models/users');
var router = express.Router();

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function (entity) {
    if (entity) {
      return res.status(statusCode).json(entity);
    }
    return null;
  };
}

function handleError(res, statusCode) {
  statuscode = statusCode || 500;
  return function (err) {
    res.status(statusCode).send(err);
  }
}

router.get('/', function (req, res) {
  User.find().exec().then(respondWithResult(res))
    .catch(handleError(res));
});


router.post('/register', function (req, res) {
  console.log(req.body);
  User.register(new User({ username: req.body.username }),
    req.body.password, function (err, account) {
      if (err) {
        return res.status(500).json({
          err: err
        });
        console.log(err);
      }
      passport.authenticate('local')
        (req, res, function () {
          // var token;
          // token = user.generateJwt();
          return res.status(201).json({
            status: 'Registration successful!',
            // 'token': token
          });
        });
    });
});

router.post('/login', function (req, res, next) {
  console.log(req.body);
  passport.authenticate('local', function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({
        err: 'User not found'
      });
    }
    req.logIn(user, function (err) {
      if (err) {
        return res.status(500).json({
          err: 'Could not log in user'
        });
      }
      var token;
      token = user.generateJwt();
      res.status(200).json({
        status: 'Login successful!',
        'username': user.email,
        'id': user._id,
        'token': token,
        'password': user.password
      });
    });
  })(req, res, next);
});

router.get('/logout', function (req, res) {
  console.log(req.body);
  req.logOut();
  res.status(200).json({
    status: 'Successfully logged out'
  });
});

router.get('/ping', function (req, res) {
  res.status(200).send('Pong!');
});

module.exports = router;