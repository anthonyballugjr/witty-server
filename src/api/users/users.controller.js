var passport = require('passport');

var Users = require('./users.model.js');

var controller = {
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
      .catch((err) => res.status(400).send({ errors: err.errors }));
  },
  login: function (req, res, next) {
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
  me: function (req, res, next) {
    var { payload: { id } } = req;

    return Users.findById(id)
      .then((user) => {
        if (!user) {
          return res.sendStatus(400);
        }

        return res.json({ user: user.toAuthJSON() });
      });
  }
};

module.exports = controller;