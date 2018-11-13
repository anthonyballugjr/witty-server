var Archives = require('./archives.model');
var handler = require('../../services/handler');

var controller = {
  getEntries: (req, res) => {
    var userId = req.query.userId
    return Archives.find(userId ? { userId: userId } : {})
      .exec()
      .then((archives) => {
        res.status(200).send(archives.map(archive => {
          return {
            _id: archive._id,
            period: archive.period,
            totalBudget: archive.totalBudget,
            totalExpenses: archive.totalExpenses,
            totalSavings: archive.totalSavings
          };
        }))
      })
      .catch(handler.handleError(res));
  },
  getEntry: function (req, res) {
    return Archives.findById(req.params.id)
      .exec()
      .then(handler.handleEntityNotFound(res))
      .then((archive) => {
        res.status(200).send({
          _id: archive._id,
          period: archive.period,
          totalBudget: archive.totalBudget,
          totalExpenses: archive.totalExpenses,
          totalSavings: archive.totalSavings,
          extraSavings: archive.extraSavings
        });
      })
      .then(handler.respondWithResult(res))
      .catch(handler.handleError(res));
  },
  overview: function (req, res) {
    var period = req.query.period
    var userId = req.params.userId
    return Archives.find(period ? { userId: userId, period: period } : { userId: userId })
      .exec()
      .then(handler.handleEntityNotFound(res))
      .then((archives) => {
        var grandTotalBudget = 0;
        var grandTotalExpenses = 0;
        var grandTotalSavings = 0;
        var data = {
          x: archives.map(archive => {
            grandTotalBudget += archive.totalBudget
            grandTotalExpenses += archive.totalExpenses
            grandTotalSavings += archive.totalDeposits
            return {
              period: archive.period,
              totalBudget: archive.totalBudget,
              totalExpenses: archive.totalExpenses,
              totalSavings: archive.totalDeposits,
              extraSavings: archive.extraSavings
            }
          }),
          grandTotalBudget: grandTotalBudget ? grandTotalBudget : 0,
          grandTotalExpenses: grandTotalExpenses,
          grandTotalSavings: grandTotalSavings,
          averageMonthlyBudget: grandTotalBudget / archives.length,
          averageMonthlyExpenses: grandTotalExpenses / archives.length,
          averageMonthlySavings: grandTotalSavings / archives.length,
          grandTotalExtraSavings: grandTotalBudget - (grandTotalExpenses + grandTotalSavings)
        }
        res.send(data);
      })
  },
  create: function (req, res) {
    return Archives.create(req.body)
      .then(handler.respondWithResult(res, 201))
      .catch(handler.handleError(res));
  },
  destroy: function (req, res){
    if (req.body._id) {
      Reflect.deleteProperty(req.body, '_id');
    }
    return Archives.findByIdAndRemove(req.params.id).exec()
      .then(handler.handleEntityNotFound(res))
      .then(handler.respondWithResult(res, 204))
      .catch(handler.handleError(res));
  }

}

module.exports = controller;