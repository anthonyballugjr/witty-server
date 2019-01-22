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
                populate: { path: 'deposits withdrawals' }
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
                var overallWithdrawals = 0;
                var overallBudget = 0;

                var ewallets = user.eWallets;
                var swallets = user.sWallets;

                var overallEWallets = 0;
                var overallTransactions = 0;
                var walletGoals = 0;

                ewallets.map(ewallet => {
                    var walletExpenses = 0;

                    ewallet.transactions.forEach(transaction => {
                        walletExpenses += transaction.amount;
                    });
                    overallEWallets += ewallet.amount;
                    overallTransactions += walletExpenses;
                });

                swallets.map(swallet => {
                    var walletDeposits = 0;
                    var walletWithdrawals = 0;
                    swallet.deposits.forEach(deposit => {
                        walletDeposits += deposit.amount;
                    });
                    swallet.withdrawals.forEach(withdrawal => {
                        walletWithdrawals += withdrawal.amount;
                    });
                    overallDeposits += walletDeposits;
                    overallWithdrawals += walletWithdrawals;
                });
                overallBudget = overallEWallets + overallDeposits;
                overallExpenses = overallTransactions + overallWithdrawals;

                var data = {
                    _id: userId,
                    overallBudget: overallBudget,
                    overallDeposits: overallDeposits,
                    overallEWallets: overallEWallets,
                    overallWithdrawals: overallWithdrawals,
                    overallExpenses: overallExpenses,
                    overallTransactions: overallTransactions,
                    overallWithdrawals: overallWithdrawals,
                    overallSavings: overallDeposits - overallWithdrawals,
                    overallExtra: overallBudget - (overallExpenses + overallDeposits),
                    averageMonthlyBudget: overallBudget / (swallets.length + ewallets.length),
                    averageMonthlySavings: (overallDeposits - overallWithdrawals) / swallets.length,
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
                populate: { path: 'deposits withdrawals' }
            })
            .exec()
            .then(handler.handleEntityNotFound(res))
            .then(user => {
                var ewallets = user.eWallets;
                var swallets = user.sWallets;

                var totalEWallets = 0;
                var totalTransactions = 0;

                ewallets.map(ewallet => {
                    var walletExpenses = 0;
                    ewallet.transactions.forEach(transaction => {
                        if (ewallet.period === queryPeriod) {
                            walletExpenses = walletExpenses + transaction.amount
                        }
                    })
                    totalEWallets = ewallet.period === queryPeriod ? totalEWallets + ewallet.amount : totalEWallets + 0;
                    totalTransactions += walletExpenses;
                });

                var totalDeposits = 0;
                var totalWithdrawals = 0;
                swallets.map(swallet => {
                    var walletDeposits = 0;
                    var walletWithdrawals = 0;
                    swallet.deposits.forEach(deposit => {
                        if (deposit.period === queryPeriod) {
                            walletDeposits = walletDeposits + deposit.amount;
                        }
                    });
                    swallet.withdrawals.forEach(withdrawal => {
                        var x = moment(withdrawal.createdAt).format('MMMM YYYY');
                        if (x === queryPeriod) {
                            walletWithdrawals = walletWithdrawals + withdrawal.amount;
                        }
                    });
                    totalDeposits = totalDeposits + walletDeposits;
                    totalWithdrawals = totalWithdrawals + walletWithdrawals;

                });
                var totalBudget = totalDeposits + totalEWallets;
                var totalExpenses = totalWithdrawals + totalTransactions;
                var totalSavings = totalBudget - totalExpenses;
                var data = {
                    userId: userId,
                    totalBudget: totalBudget,
                    totalDeposits: totalDeposits,
                    totalEWallets: totalEWallets,
                    totalExpenses: totalExpenses,
                    totalWithdrawals: totalWithdrawals,
                    totalTransactions: totalTransactions,
                    period: queryPeriod,
                    totalSavings: totalSavings,
                    extraSavings: totalBudget - (totalExpenses + totalSavings)
                }
                res.send(data);
            })
            .catch(handler.handleError(res));
    }
}

module.exports = controller;