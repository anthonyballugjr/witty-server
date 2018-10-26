var passport = require('passport');
var mailer = require('../../services/mailer');
var decode = require('jwt-decode');

var Users = require('./users.model.js');

var authentication = {
  register: function (req, res, next) {
    var { body: { user } } = req;

    if (!user.email) {
      return res.status(422).json({
        errors: {
          email: 'is required',
        },
      });
    }
    if (!user.password) {
      return res.status(422).json({
        errors: {
          password: 'is required',
        },
      });
    }

    var finalUser = new Users(user);

    finalUser.setPassword(user.password);

    return finalUser.save()
      .then(() => {
        var user = finalUser.utilityAuth();
        var msg = mailer.activateOptions(user);
        mailer.sendMail(msg);
        res.json({
          user: user,
          message: 'An email has been sent to ' + user.email + ' for completion of the registration process.'
        });
      })
      .catch((err) => res.status(400).send(err.message));
  },
  activate: function (req, res) {
    var token = decode(req.params.token);
    var email = token.email;
    var today = new Date();
    var expired = parseInt(today.getTime() / 1000, 10);
    var expiration = token.exp;

    Users.findOne({ email: email })
      .exec()
      .then(function (user) {
        if (user) {
          if (expiration < expired) {
            res.send('The activation token seems to be invalid or expired');
          }
          else {
            user.activated = true;

            return user.save()
              .then(() => res.status(200).send('Your account has been activated! You can now login using the application'))
              .catch((err) => res.status(400).send(err));
          }
        }
      })

  },
  login: function (req, res, next) {
    console.log(req.headers);
    var { body: { user } } = req;

    if (!user.email) {
      return res.status(422).json({
        errors: {
          email: 'is required',
        },
      });
    }

    if (!user.password) {
      return res.status(422).json({
        errors: {
          password: 'is required',
        },
      });
    }

    return passport.authenticate('local', { session: false }, (err, passportUser, info) => {
      if (err) {
        return next(info);
      }

      if (passportUser) {
        var user = passportUser;
        user.token = passportUser.generateJWT();

        return res.json({ user: user.toAuthJSON() });
      }

      return res.status(401).send(info);
    })(req, res, next);
  },
  logout: function (req, res) {
    req.logout();
    res.status(200).json({
      status: 'Successfully logged out'
    });
  },
  me: function (req, res, next) {
    var { payload: { id } } = req;

    return Users.findById(id)
      .then((user) => {
        if (!user) {
          return res.sendStatus(400);
        }

        return res.json({ user: user.toAuthJSON() });
      });
  },
  changePassword: function (req, res) {
    var userId = req.payload.id;
    var oldPassword = req.body.oldPassword
    var newPassword = req.body.newPassword
    var confirmPassword = req.body.confirmPassword

    if (confirmPassword !== newPassword) {
      return res.status(400).send('New password did not match');
    }
    if (oldPassword === newPassword) {
      return res.status(400).send('New password cannot be the same as current password');
    }
    return Users.findById(userId)
      .then(function (user) {
        if (!user) {
          return res.status(400).send('User not found!');
        }
        if (!user.validatePassword(oldPassword)) {
          return res.status(400).send('Current password is incorrect!');
        }
        user.setPassword(newPassword);
        return user.save()
          .then(() => res.json(user))
          .catch((err) => res.status(400).send(err));
      });
  },
  forgotPassword: function (req, res) {
    var email = req.params.email;

    return Users.findOne({ email: email })
      .exec()
      .then(function (user) {
        if (user) {
          var fUser = user.utilityAuth();

          var msg = mailer.requestOptions(fUser);
          mailer.sendMail(msg)
          res.status(200).send('Request confirmed, please check your email to complete the process.');
        }
        else {
          return res.status(401).send('User does not exist');
        }
      })
  },
  resetPassword: function (req, res) {
    var token = decode(req.params.token);
    var expiration = token.exp;
    var email = token.email
    var today = new Date();
    var expired = parseInt(today.getTime() / 1000, 10);
    var temporary = Math.random().toString(36).substring(6);

    return Users.findOne({ email: email })
      .exec()
      .then(function (user) {
        if (user) {
          if (expiration < expired) {
            res.status(400).send('Password reset token seems to be invalid or expired');
          }
          else {
            user.setPassword(temporary);
            return user.save()
              .then(() => {
                var resetOptions = mailer.resetOptions(user, temporary);
                mailer.sendMail(resetOptions);
                res.status(200).send('Password has been reset for user: ' + user.email);
              })
              .catch((err) => res.status(400).send(err))
          }
        }
      });
  }
};

module.exports = authentication;