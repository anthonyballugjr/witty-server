var User = require('../users/users.model');
var Archive = require('../archives/archives.model');
var handler = require('../../services/handler');
var moment = require('moment');

var month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var n = new Date();
var m = month[n.getMonth()];
var nm = m === 'December' ? month[n.getMonth() - 11] : month[n.getMonth() + 1];
var pm = m === 'January' ? month[n.getMonth + 11] : month[n.getMonth() - 1];
var y = n.getFullYear();
var ny = nm === 'January' ? n.getFullYear() + 1 : n.getFullYear();
var py = pm === 'December' ? n.getFullYear() - 1 : n.getFullYear();
var cPeriod = m + " " + y;
var nPeriod = nm + " " + ny;
var pPeriod = pm + " " + py

var controller = {
    budgetProfile: function (req, res) {
        var userId = req.params.userId;

        return User.findOne({ _id: userId })
            .populate({
                path: 'sWallets',
                populate: { path: 'deposits' }
            })
            .populate({
                path: 'eWallets',
                populate: { path: 'transactions' }
            })
            .exec()
            .then(handler.handleEntityNotFound(res))
            // .then(handler.respondWithResult(res))
            .then(user => {
                var overallExpenses = 0;
                var overallDeposits = 0;
                var overallBudget = 0;

                var ewallets = user.eWallets;
                var swallets = user.sWallets;

                var walletBudgets = 0;
                var walletGoals = 0;

                ewallets.map(ewallet => {
                    var walletExpenses = 0;

                    ewallet.transactions.forEach(transaction => {
                        walletExpenses += transaction.amount;
                    });
                    walletBudgets += ewallet.amount;
                    overallExpenses += walletExpenses;
                });

                swallets.map(swallet => {
                    var walletDeposits = 0;

                    swallet.deposits.forEach(deposit => {
                        walletDeposits += deposit.amount;
                    });
                    overallDeposits += walletDeposits;
                });
                overallBudget += (walletBudgets + overallDeposits);

                var data = {
                    _id: userId,
                    overallBudget: overallBudget,
                    overallDeposits: overallDeposits,
                    overallExpenses: overallExpenses,
                    overallExtra: overallBudget - (overallDeposits + overallExpenses),
                    averageMonthlyBudget: (overallBudget + overallDeposits) / (swallets.length + ewallets.length),
                    averageMonthlySavings: overallDeposits / swallets.length,
                    averageMonthlyExpenses: overallExpenses / ewallets.length
                }
                res.status(200).send(data);
            })
            .catch(handler.handleError(res));
    },
    overview: function (req, res) {
        var userId = req.params.userId;
        var queryPeriod = req.query.period;

        return User.findOne({ _id: userId })
            .populate({
                path: 'eWallets',
                populate: { path: 'transactions' }
            })
            .populate({
                path: 'sWallets',
                populate: { path: 'deposits', path: 'withdrawals' }
            })
            .exec()
            .then(handler.handleEntityNotFound(res))
            .then(user => {
                var ewallets = user.eWallets;
                var swallets = user.sWallets;

                var totalEWallets = 0;
                var totalExpenses = 0;
                ewallets.map(ewallet => {
                    var walletExpenses = 0;
                    ewallet.transactions.forEach(transaction => {
                        if (ewallet.period === queryPeriod) {
                            walletExpenses = walletExpenses + transaction.amount
                        }
                    })
                    totalEWallets = ewallet.period === queryPeriod ? totalEWallets + ewallet.amount : totalEWallets + 0;
                    totalExpenses += walletExpenses;
                });
                var totalDeposits = 0;
                swallets.map(swallet => {
                    var walletDeposits = 0;
                    swallet.deposits.forEach(deposit => {
                        if (deposit.period === queryPeriod) {
                            walletDeposits = walletDeposits + deposit.amount;
                        }
                    });
                    totalDeposits += walletDeposits;
                });
                var totalWithdrawals = 0;
                swallets.map(swallet => {
                    var walletWithdrawals = 0;
                    swallet.withdrawals.forEach(withdrawal => {
                        var period = moment(withdrawal.date).format('MMMM YYYY');
                        if (period === queryPeriod) {
                            walletWithdrawals = walletWithdrawals + withdrawal.amount;
                        }
                    });
                    totalWithdrawals += walletWithdrawals;
                });
                var totalBudget = totalEWallets + (totalDeposits - totalWithdrawals);
                var data = {
                    userId: userId,
                    totalDeposits: totalDeposits,
                    totalWithdrawals: totalWithdrawals,
                    totalBudget: totalBudget,
                    totalExpenses: totalExpenses,
                    period: queryPeriod,
                    extraSavings: totalBudget - (totalExpenses + totalDeposits)
                }
                res.send(data);
            })
            .catch(handler.handleError(res));
    }
}

module.exports = controller;