var Expense = require('./expenses.model');
var handler = require('../../services/handler');
var moment = require('moment');
const MLR = require('ml-regression-multivariate-linear');

var month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var n = new Date();
var m = month[n.getMonth()];
var nm = m === 'December' ? month[n.getMonth() - 11] : month[n.getMonth() + 1];
var pm = m === 'January' ? month[n.getMonth() + 11] : month[n.getMonth() - 1];
var y = n.getFullYear();
var ny = nm === 'January' ? n.getFullYear() + 1 : n.getFullYear();
var py = pm === 'December' ? n.getFullYear() - 1 : n.getFullYear();
var cPeriod = moment(n).format("MMMM YYYY");
var nPeriod = nm + " " + ny;
var pPeriod = pm + " " + py

var controller = {
    getEntries: function (req, res) {
        var name = req.query.name;

        return Expense.find(name ? { name: name } : {})
            .populate('transactions')
            .exec()
            .then(handler.handleEntityNotFound(res))
            // .then((wallets) => {
            //     res.status(200).send(wallets.map(wallet => {
            //         return {
            //             _id: wallet._id,
            //             name: wallet.name,
            //             amount: wallet.amount,
            //             transactions: wallet.transactions.length !== 0 ? wallet.transactions : 'No Transactions',
            //             period: wallet.period
            //         };
            //     }));
            // })
            .then(handler.respondWithResult(res))
            .catch(handler.handleError(res));
    },
    create: function (req, res) {
        return Expense.create(req.body)
            .then(handler.respondWithResult(res, 201))
            .catch(handler.handleError(res));
    },
    update: function (req, res) {
        if (req.body._id) {
            Reflect.deleteProperty(req.body, '_id');
        }
        return Expense.findByIdAndUpdate(req.body.id, req.body, {
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
        return Expense.findByIdAndRemove(req.params.id).exec()
            .then(handler.handleEntityNotFound(res))
            .then(handler.respondWithResult(res, 204))
            .catch(handler.handleError(res));
    },
    getMyWallets: function (req, res) {
        var period = req.query.period
        var user = req.params.userId

        return Expense.find(period ? { userId: user, period: period } : { userId: user })
            .populate('transactions')
            .populate('category', '-wallets')
            .exec()
            .then(handler.handleEntityNotFound(res))
            .then((wallets) => {
                res.status(200).send(wallets.map(wallet => {

                    var category = wallet.category;
                    var icon = "";
                    var catDesc = "";
                    category.map(i => {
                        icon = i.icon;
                        catDesc = i.desc;
                    })

                    return {
                        _id: wallet._id,
                        name: wallet.name,
                        type: wallet.type,
                        amount: wallet.amount,
                        categoryId: wallet.categoryId,
                        period: wallet.period,
                        createdAt: moment(wallet.createdAt).format('MMMM DD, YYYY - dddd'),
                        icon: icon,
                        category: catDesc,
                        transactions: wallet.transactions.length !== 0 ? wallet.transactions.map(transaction => {
                            return {
                                _id: transaction._id,
                                desc: transaction.desc,
                                amount: transaction.amount,
                                date: moment(transaction.createdAt).format('MMMM DD, YYYY - dddd'),
                                created: moment(transaction.createdAt).fromNow()
                            }
                        }) : 0
                    }
                }))
            })
            .catch(handler.handleError(res));
    },
    overview: function (req, res) {
        var userId = req.params.userId
        var period = req.query.period

        return Expense.find(period ? { userId: userId, period: period } : { userId: userId })
            .populate('transactions')
            .exec()
            .then(handler.handleEntityNotFound(res))
            .then(wallets => {
                var budgetTotal = 0;
                var totalExpenses = 0;
                wallets.map(wallet => {
                    var walletExpenses = 0;
                    wallet.transactions.forEach(transaction => {
                        walletExpenses = walletExpenses + transaction.amount
                    });

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
                    userId: userId,
                    period: period,
                    totalBudget: budgetTotal,
                    totalExpenses: totalExpenses,
                    // extraSavings: budgetTotal - (totalExpenses + savingsW),
                }
                res.send(data);
            })
            // .then(handler.respondWithResult(res))
            .catch(handler.handleError(res));
    },
    getNext: function (req, res) {
        var userId = req.params.userId;

        Expense.find({ userId: userId })
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

        Expense.find({ userId: userId })
            .where('name', name)
            .populate('transactions')
            .exec()
            .then((wallets) => {

                const x = [];
                const y = [];

                var budgetTotal = 0;
                var totalExpenses = 0;
                let prediction = [];

                (function(){
                   
                       wallets.map(wallet => {
                        var walletExpenses = 0;
                        budgetTotal += wallet.amount;

                        wallet.transactions.forEach(transaction => {
                            walletExpenses += transaction.amount
                        })

                        totalExpenses = totalExpenses + walletExpenses;
                        var variance = wallet.amount - walletExpenses;

                        x.push([parseFloat(wallet.amount)]);
                        y.push([parseFloat(walletExpenses)]);

                        const mlr = new MLR(x, y);
                        let pred = x[x.length - 2] && x[x.length - 3] ? mlr.predict([x[x.length - 1], x[x.length - 2], x[x.length - 3]]) : mlr.predict(x[x.length - 1]);
                        
                        prediction.push({
                            name: wallet.name,
                            userId: wallet.userId,
                            amount: wallet.categoryId === 'bll' || wallet.categoryId === 'dbt' ? wallet.amount : Math.ceil(pred[0]),
                            categoryId: wallet.categoryId,
                            period: cPeriod
                        })

                        // return wallet.period === pPeriod ? {
                        //     name: wallet.name,
                        //     userId: wallet.userId,
                        //     amount: wallet.categoryId === 'bll' || wallet.categoryId === 'dbt' ? wallet.amount : Math.ceil(pred[0]),
                        //     categoryId: wallet.categoryId,
                        //     period: cPeriod,
                        // } : null
                    })
            })();
                res.status(200).send(prediction);
                console.log('Predict', prediction);
            })
            .catch(handler.handleError(res));
    },
    predictNext: function (req, res) {
        var userId = req.params.userId;
        var name = req.query.name;

        Expense.find({ userId: userId })
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

                        wallet.transactions.forEach(transaction => {
                            walletExpenses += transaction.amount
                        })
                        totalExpenses = totalExpenses + walletExpenses;
                        var variance = wallet.amount - walletExpenses;

                        x.push([parseFloat(wallet.amount)]);
                        y.push([parseFloat(walletExpenses)]);

                        const mlr = new MLR(x, y);
                        var pred = mlr.predict(x[x.length - 1]);

                        return wallet.period === cPeriod ? {
                            name: wallet.name,
                            userId: wallet.userId,
                            amount: wallet.categoryId === 'bll' || wallet.categoryId === 'dbt' ? wallet.amount : pred[0],
                            categoryId: wallet.categoryId,
                            period: nPeriod,
                        } : null
                    })
                }
                res.status(200).send(data);
            })
            .catch(handler.handleError(res));
    },
    tOverview: function (req, res) {
        var categoryId = req.query.categoryId;
        var period = req.query.period;
        var userId = req.params.userId;

        return Expense.find({ period: period, categoryId: categoryId, userId: userId })
            .populate('transactions')
            .populate('category -wallets')
            .exec()
            .then(handler.handleEntityNotFound(res))
            .then(wallets => {
                var totalTransactions = 0;
                var categoryDesc = "";
                wallets.map(wallet => {

                    var category = wallet.category;
                    category.map(i => {
                        categoryDesc = i.desc;
                    })

                    wallet.transactions.forEach(transaction => {
                        totalTransactions += transaction.amount
                    });
                })
                res.send({ totalTransactions: totalTransactions, category: categoryDesc });
            });
    }

}
module.exports = controller;