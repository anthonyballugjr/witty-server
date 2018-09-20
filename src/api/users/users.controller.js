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
    if (req.body._id) {
      Reflect.deleteProperty(req.body, '_id');
    }
    return Users.findByIdAndUpdate(req.params.id, req.body, {
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
    var id = req.params.id
    return Users.findById(id)
      .exec()
      .then(handler.handleEntityNotFound(res))
      .then((user) => {
        res.status(200).send({
          _id: user._id,
          email: user.email,
          name: user.name
        });
      })
      .catch(handler.handleError(res));
  }
};

module.exports = controller;
