var passport = require('passport');

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
      .then(() => res.json({ user: finalUser.toAuthJSON() }))
      .catch((err) => res.status(400).send(err.message));
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
          .catch((err) => res.status(400).send(err.message));
      });
  }
};

module.exports = authentication;