var Challenge = require('./challenge.model');
var handler = require('../../services/handler');

var controller = {
  getEntries: function (req, res) {
    var userId = req.query.userId

    return Challenge.find(userId ? { userId: userId } : {})
      .exec()
      .then(handler.handleEntityNotFound(res))
      .then(handler.respondWithResult(res))
      .catch(handler.handleError(res));
  },
  create: function (req, res) {
    return Challenge.create(req.body)
      .then(handler.respondWithResult(res, 201))
      .catch(handler.handleError(res));
  },
  update: function (req, res) {
    if (req.body._id) {
      Reflect.deleteProperty(req.body, '_id');
    }
    return Challenge.findByIdAndUpdate(req.body.id, req.body, {
      new: true,
      upsert: true,
      setDefaultOnInsert: true,
      runValidators: true
    }).exec()
      .then(handler.handleEntityNotFound(res))
      .then(handler.respondWithResult(res))
      .catch(handler.handleError(res));
  },
  destroy: function (req, res) {
    if (req.body._id) {
      Reflect.deleteProperty(req.body, '_id');
    }
    return Challenge.findByIdAndRemove(req.params.id)
      .exec()
      .then(handler.handleEntityNotFound(res))
      .then(handler.respondWithResult(res, 204))
      .catch(handler.handleError(res));
  }
}

module.exports = controller;