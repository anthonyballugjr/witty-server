var Wallet = require('./wallets.model');
var handler = require('../../services/handler');
var decode = require('jwt-decode');

var month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var n = new Date();
var m = month[n.getMonth()];
var y = n.getFullYear();
var period = m + " " + y;

var view = (data) => {
    return {
        _id: data._id,
        name: data.name,
        amount: data.amount,
        categoryId: data.categoryId,
        transactions: data.transactions
    }
};

var controller = {
    getEntries: function (req, res) {
        return Wallet.find()
            .populate('transactions')
            .exec()
            .then((wallets) => {
                res.status(200).send(wallets.map(wallet => {
                    return {
                        _id: wallet._id,
                        name: wallet.name,
                        amount: wallet.amount,
                        transactions: wallet.transactions.length !== 0 ? wallet.transactions : 0,
                        period: wallet.period
                    };
                }));
            })
            // .then(handler.respondWithResult(res))
            .catch(handler.handleError(res));
    },
    getMyWallets: function (req, res) {
        // console.log(req);
        // var user = decode(req.get('Authorization').splice(' ')[1]);
        // var query = {userId: user.id};
        // console.log(user);
        var period = req.query.period
        var user = req.params.user
        return Wallet.find(period ? { userId: user, period: period } : { userId: user })
            // return Wallet.find()
            .populate('transactions')
            .populate('category', '-wallets')
            // .where('period', period)
            .exec()
            .then(handler.handleEntityNotFound(res))
            .then(handler.respondWithResult(res))
            .catch(handler.handleError(res));
    },
    overview: function (req, res) {
        var user = req.params.user
        var period = req.query.period
        return Wallet.find(period ? { userId: user, period: period } : { userId: user })
            .populate('transactions')
            .exec()
            .then(handler.handleEntityNotFound(res))
            .then(wallets => {
                var budgetTotal = 0;
                var totalExpenses = 0;
                var data = {
                    userWallets: wallets.map(wallet => {
                        var walletExpenses = 0;
                        wallet.transactions.forEach(transaction => {
                            walletExpenses = walletExpenses + transaction.amount
                        });
                        budgetTotal = budgetTotal + wallet.amount;
                        totalExpenses = totalExpenses + walletExpenses;
                        return {
                            walletType: wallet.type,
                            walletName: wallet.name,
                            walletAmount: wallet.amount,
                            walletTransactions: walletExpenses,
                            walletCategory: wallet.categoryId,
                            period: wallet.period
                        };
                    }),
                    totalBudget: budgetTotal,
                    totalExpenses: totalExpenses,
                    averageBudget: budgetTotal / wallets.length,
                    period: period
                }
                res.send(data);
            })
            // .then(handler.respondWithResult(res))
            .catch(handler.handleError(res));
    },
    create: function (req, res) {
        return Wallet.create(req.body)
            .then(handler.respondWithResult(res, 201))
            .catch(handler.handleError(res));
    },
    update: function (req, res) {
        if (req.body._id) {
            Reflect.deleteProperty(req.body, '_id');
        }
        return Wallet.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            upsert: true,
            setDefaultsOnInsert: true,
            runValidators: true
        }).exec()
            .then(handler.handleEntityNotFound(res))
            .then(handler.respondWithResult(res, 201))
            .catch(handler.handleError(res));
    },
    destroy: function (req, res) {
        if (req.body._id) {
            Reflect.deleteProperty(req.body, '_id');
        }
        return Wallet.findByIdAndRemove(req.params.id).exec()
            .then(handler.handleEntityNotFound(res))
            .then(handler.respondWithResult(res, 204))
            .catch(handler.handleError(res));
    },
    createBudget: function (req, res) {
        var userId = req.params.userId
        var month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        var n = new Date();
        var m = month[n.getMonth()];
        var next = month[n.getMonth() + 1];
        var y = n.getFullYear();
        var period = m + " " + y;
        var nextPeriod = next + " " + y

        Wallet.find({ userId: userId })
            .where('period', period)
            .exec()
            .then((wallets) => {
                var nextData = {
                    next: wallets.map(wallet => {
                        return {
                            name: wallet.name,
                            amount: 0,
                            categoryId: wallet.categoryId,
                            userId: wallet.userId,
                            type: wallet.type,
                            period: nextPeriod
                        }
                    })
                }
                res.send(nextData);
            })

    }
};

module.exports = controller;