var Wallet = require('./wallets.model');
var handler = require('../../services/handler');
const MLR = require('ml-regression-multivariate-linear');

var month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var n = new Date();
var m = month[n.getMonth()];
var nm = month[n.getMonth() + 1];
var y = n.getFullYear();
var ny = nm === 'December' ? n.getFullYear() + 1 : n.getFullYear();
var cPeriod = m + " " + y;
var nPeriod = nm + " " + ny;

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
        var name = req.query.name;

        return Wallet.find(name ? { name: name } : {})
            .populate('transactions')
            .exec()
            .then((wallets) => {
                res.status(200).send(wallets.map(wallet => {
                    return {
                        _id: wallet._id,
                        name: wallet.name,
                        amount: wallet.amount,
                        transactions: wallet.transactions.length !== 0 ? wallet.transactions : 'No Transactions',
                        period: wallet.period
                    };
                }));
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
    getMyWallets: function (req, res) {
        var period = req.query.period
        var user = req.params.userId

        return Wallet.find(period ? { userId: user, period: period } : { userId: user })
            .populate('transactions')
            .populate('category', '-wallets')
            .exec()
            .then(handler.handleEntityNotFound(res))
            .then(handler.respondWithResult(res))
            .catch(handler.handleError(res));
    },
    overview: function (req, res) {
        var user = req.params.userId
        var period = req.query.period

        return Wallet.find(period ? { userId: user, period: period } : { userId: user })
            .populate('transactions')
            .exec()
            .then(handler.handleEntityNotFound(res))
            .then(wallets => {
                var budgetTotal = 0;
                var totalExpenses = 0;
                var savingsW = 0;
                var expenseW = 0;
                wallets.map(wallet => {
                    var walletExpenses = 0;
                    wallet.transactions.forEach(transaction => {
                        walletExpenses = walletExpenses + transaction.amount
                    });

                    expenseW = wallet.type === "expense" ? expenseW + wallet.amount : expenseW
                    savingsW = wallet.type === "savings" ? savingsW + wallet.amount : savingsW
                    budgetTotal = budgetTotal + wallet.amount;
                    totalExpenses = totalExpenses + walletExpenses;
                    // return {
                    //     walletType: wallet.type,
                    //     walletName: wallet.name,
                    //     walletAmount: wallet.amount,
                    //     walletTransactions: walletExpenses,
                    //     walletCategory: wallet.categoryId,
                    //     period: wallet.period
                    // };
                })
                var data = {
                    period: period,
                    totalBudget: budgetTotal,
                    savingsWallets: savingsW,
                    expenseWallets: expenseW,
                    totalExpenses: totalExpenses,
                    extraSavings: budgetTotal - (totalExpenses + savingsW),
                }
                res.send(data);
            })
            // .then(handler.respondWithResult(res))
            .catch(handler.handleError(res));
    },
    getNext: function (req, res) {
        var userId = req.params.userId;

        Wallet.find({ userId: userId })
            .where('period', cPeriod)
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
                            period: nPeriod
                        };
                    })
                }
                res.send(nextData);
            })

    },
    predict: function (req, res) {
        var userId = req.params.userId;
        var name = req.query.name;

        Wallet.find({ userId: userId })
            .where('name', name)
            .populate('transactions')
            .exec()
            .then((wallets) => {

                const x = [];
                const y = [];

                var budgetTotal = 0;
                var totalExpenses = 0;

                var data = {
                    x: wallets.map(wallet => {
                        var walletExpenses = 0;
                        budgetTotal += wallet.amount;
                        totalExpenses += walletExpenses;

                        wallet.transactions.forEach(transaction => {
                            walletExpenses += transaction.amount
                        })
                        var variance = wallet.amount - walletExpenses;

                        // x.push([parseFloat(wallet.amount)]);
                        x.push([parseFloat(wallet.amount), parseFloat(variance)]);
                        y.push([parseFloat(walletExpenses)]);

                        const mlr = new MLR(x, y);
                        var pred = mlr.predict(x[x.length - 1]);

                        console.log("X: [" + x, "] \nY: " + y);
                        //console.log(pred[0]);
                        
                        return wallet.period === cPeriod ? {
                            wallet: wallet.name,
                            period: nPeriod,
                            categoryId: wallet.categoryId,
                            type: wallet.type,
                            userId: wallet.userId,
                            oldAmount: wallet.amount,
                            predictedAmount: wallet.type === 'expense' ? pred[0] : wallet.amount,
                            amountToPredict: walletExpenses
                        } : null
                    })
                }
                res.status(200).send(data);
            })
    },
    aggregate: function (req, res) {

        Wallet.aggregate([

            { $match: { type: 'expense' } },
            // {
            // $lookup:
            // {
            //     from: 'Transaction',
            //     localField: '_id',
            //     foreignField: 'walletId',
            //     as: 'transactions'
            // }
            // },
            // { $group: { _id: '$name', totalBudget: { $sum: '$amount' }, totalTransaction: { $sum: '$transactions.amount' } } }
            // { $group: { _id: '$name', totalBudget: '$amount' } }
        ])
            .exec()
            .then(handler.handleEntityNotFound(res))
            .then(handler.respondWithResult(res))
            // .then(wallets => {
            //      res.send(wallets);
            // })
            .catch(handler.handleError(res))
    }
}
module.exports = controller;