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
            totalDeposits: archive.totalDeposits,
            totalEWallets: archive.totalEWallets,
            totalExpenses: archive.totalExpenses,
            totalWithdrawals: archive.totalWithdrawals,
            totalTransactions: archive.totalTransactions,
            totalSavings: archive.totalSavings
          };
        }));
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
          totalDeposits: archive.totalDeposits,
          totalEWallets: archive.totalEWallets,
          totalExpenses: archive.totalExpenses,
          totalWithdrawals: archive.totalWithdrawals,
          totalTransactions: archive.totalTransactions,
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
      .limit(12)
      .exec()
      .then(handler.handleEntityNotFound(res))
      .then((archives) => {
        var grandTotalBudget = 0;
        var grandTotalDeposits = 0;
        var grandTotalEWallets = 0;
        var grandTotalExpenses = 0;
        var grandTotalWithdrawals = 0;
        var grandTotalTransactions = 0;
        var grandTotalExtraSavings = 0;
        var grandTotalSavings = 0;
        var data = {
          x: archives.map(archive => {
            grandTotalBudget += archive.totalBudget;
            grandTotalDeposits += archive.totalDeposits;
            grandTotalEWallets += archive.totalEWallets;
            grandTotalExpenses += archive.totalExpenses;
            grandTotalWithdrawals += archive.totalWithdrawals;
            grandTotalTransactions += archive.totalTransactions;
            grandTotalExtraSavings += archive.extraSavings;
            grandTotalSavings += archive.totalSavings
            return {
              period: archive.period,
              totalBudget: archive.totalBudget,
              totalDeposits: archive.totalDeposits > 0 ? archive.totalDeposits : 0,
              totalEWallets: archive.totalEWallets > 0 ? archive.totalEWallets : 0,
              totalExpenses: archive.totalExpenses > 0 ? archive.totalExpenses : 0,
              totalWithdrawals: archive.totalWithdrawals > 0 ? archive.totalWithdrawals : 0,
              totalTransactions: archive.totalTransactions > 0 ? archive.totalTransactions : 0,
              totalSavings: archive.totalSavings > 0 ? archive.totalSavings : 0,
              extraSavings: archive.extraSavings > 0 ? archive.extraSavings : 0
            }
          }),
          grandTotalBudget: grandTotalBudget,
          grandTotalDeposits: grandTotalDeposits,
          grandTotalEWallets: grandTotalEWallets,
          grandTotalExpenses: grandTotalExpenses,
          grandTotalWithdrawals: grandTotalWithdrawals,
          grandTotalTransactions: grandTotalTransactions,
          grandTotalSavings: grandTotalSavings,
          grandTotalExtraSavings: grandTotalExtraSavings,
          averageMonthlyBudget: grandTotalBudget / archives.length,
          averageMonthlyExpenses: grandTotalExpenses / archives.length,
          averageMonthlySavings: grandTotalSavings / archives.length,
          grandTotalExtraSavings: grandTotalBudget - (grandTotalExpenses + grandTotalSavings)
        }
        res.send(data);
      })
      .catch(handler.handleError(res));
  },
  create: function (req, res) {
    return Archives.create(req.body)
      .then(handler.respondWithResult(res, 201))
      .catch(handler.handleError(res));
  },
  destroy: function (req, res) {
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