var Users = require('./users.model');
var handler = require('../../services/handler');

var controller = {
  getEntries: function (req, res) {
    return Users.find()
      .select('-salt -hash')
      .exec()
      .then(handler.respondWithResult(res))
      .catch(handler.handleError(res));
  },
  destroy: function (req, res) {
    if (req.body._id) {
      Reflect.deleteProperty(req.body, '_id');
    }
    return Users.findByIdAndRemove(req.params.id)
      .exec()
      .then(handler.handleEntityNotFound(res))
      .then(handler.respondWithResult(res, 204))
      .catch(handler.handleError(res));
  },
  update: function (req, res) {
    var userId = req.payload.id;

    if (req.body._id) {
      Reflect.deleteProperty(req.body, '_id');
    }
    return Users.findByIdAndUpdate(userId, req.body, {
      new: true,
      upsert: true,
      setDefaultOnInsert: true,
      runValidators: true
    }).exec()
      .then(handler.handleEntityNotFound(res))
      .then(handler.respondWithResult(res, 201))
      .catch(handler.handleError(res));
  },
  profile: function (req, res) {
    var email = req.payload.email;

    return Users.findOne({ email: email })
      .exec()
      .then(handler.handleEntityNotFound(res))
      // .then(handler.respondWithResult(res))
      .then((user) => {
        res.status(200).json({
          _id: user._id,
          email: user.email,
          name: user.name,
          isNext: user.isNext,
          activated: user.activated
        });
      })
      .catch(handler.handleError(res));
  }
};

module.exports = controller;
