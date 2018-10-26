var Savings = require('./savings.model');
var handler = require('../../services/handler');
var moment = require('moment');
const MLR = require('ml-regression-multivariate-linear');


var controller = {
    getEntries: function (req, res) {
        var name = req.query.name;

        return Savings.find(name ? { name: name } : {})
            .populate('transactions')
            .exec()
            .then((savings) => {
                res.status(200).send(savings.map(saving => {
                    return {
                        _id: saving._id,
                        name: saving.name,
                        amount: savings.amount,
                        deposits: savings.deposits.length !== 0 ? savings.deposits : 'No Deposits',
                    };
                }));
            })
            // .then(handler.respondWithResult(res))
            .catch(handler.handleError(res));
    },
    create: function (req, res) {
        return Savings.create(req.body)
            .then(handler.respondWithResult(res, 201))
            .catch(handler.handleError(res));
    },
    update: function (req, res) {
        if (req.body._id) {
            Reflect.deleteProperty(req.body, '_id');
        }
        return Savings.findByIdAndUpdate(req.params.id, req.body, {
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
        return Savings.findByIdAndRemove(req.params.id).exec()
            .then(handler.handleEntityNotFound(res))
            .then(handler.respondWithResult(res, 204))
            .catch(handler.handleError(res));
    },
    getMySavingss: function (req, res) {
        var userId = req.params.userId

        return Savings.find({ userId: userId })
            .populate('deposits')
            .exec()
            .then(handler.handleEntityNotFound(res))
            .then((savings) => {
                res.status(200).send(savings.map(saving => {

                    var savingDeposits = 0;
                    saving.deposits.forEach(deposit=>{
                        savingDeposits += deposit.amount;
                    });

                    return {
                        _id: saving._id,
                        name: saving.name,
                        amount: saving.amount,
                        totalDesposits: savingDeposits,
                        createdAt: moment(Savings.createdAt).format('MMMM DD, YYYY - dddd'),
                        deposits: saving.deposits.length !== 0 ? saving.deposits.map(deposit => {
                            return {
                                _id: deposit._id,
                                amount: deposit.amount,
                                date: moment(deposit.createdAt).format('MMMM DD, YYYY - dddd')
                            }
                        }) :'No Deposits'
                    }
                }))
            })
            // .then(handler.respondWithResult(res))
            .catch(handler.handleError(res));
    },
    overview: function (req, res) {
        var userId = req.params.userId
        var period = req.query.period

        return Savings.find(period ? { userId: userId, period: period } : { userId: userId })
            .populate('transactions')
            .exec()
            .then(handler.handleEntityNotFound(res))
            .then(Savingss => {
                var budgetTotal = 0;
                var totalExpenses = 0;
                var savingsW = 0;
                var expenseW = 0;
                Savingss.map(Savings => {
                    var SavingsExpenses = 0;
                    Savings.transactions.forEach(transaction => {
                        SavingsExpenses = SavingsExpenses + transaction.amount
                    });

                    expenseW = Savings.type === "expense" ? expenseW + Savings.amount : expenseW
                    savingsW = Savings.type === "savings" ? savingsW + Savings.amount : savingsW
                    budgetTotal = budgetTotal + Savings.amount;
                    totalExpenses = totalExpenses + SavingsExpenses;
                    // return {
                    //     SavingsType: Savings.type,
                    //     SavingsName: Savings.name,
                    //     SavingsAmount: Savings.amount,
                    //     SavingsTransactions: SavingsExpenses,
                    //     SavingsCategory: Savings.categoryId,
                    //     period: Savings.period
                    // };
                })
                var data = {
                    userId: userId,
                    period: period,
                    totalBudget: budgetTotal,
                    totalSavings: savingsW,
                    totalExpenses: totalExpenses,
                    // extraSavings: budgetTotal - (totalExpenses + savingsW),
                }
                res.send(data);
            })
            // .then(handler.respondWithResult(res))
            .catch(handler.handleError(res));
    },
    
}
module.exports = controller;