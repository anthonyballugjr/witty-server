var Savings = require('./savings.model');
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
    getEntries: function (req, res) {
        var name = req.query.name;

        return Savings.find(name ? { name: name } : {})
            .populate('deposits')
            .exec()
            .then((savings) => {
                res.status(200).send(savings.map(saving => {
                    return {
                        _id: saving._id,
                        name: saving.name,
                        goal: saving.goal,
                        deposits: saving.deposits.length !== 0 ? saving.deposits : 0,
                    };
                }));
            })
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
        return Savings.findByIdAndUpdate(req.params.id, { $set: req.body }, {
            new: true,
            upsert: true,
            setDefaultsOnInsert: true,
            runValidators: true,
            context: 'query'
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
    getMySavings: function (req, res) {
        var userId = req.params.userId

        return Savings.find({ userId: userId })
            .populate('deposits')
            .exec()
            .then(handler.handleEntityNotFound(res))
            .then((savings) => {
                res.status(200).send(savings.map(saving => {

                    var savingDeposits = 0;
                    saving.deposits.forEach(deposit => {
                        savingDeposits += deposit.amount;
                    });

                    return {
                        _id: saving._id,
                        name: saving.name,
                        goal: saving.goal,
                        totalDeposits: savingDeposits,
                        createdAt: moment(Savings.createdAt).format('MMMM DD, YYYY - dddd'),
                        deposits: saving.deposits.length !== 0 ? saving.deposits.map(deposit => {
                            return {
                                _id: deposit._id,
                                period: deposit.period,
                                amount: deposit.amount,
                                date: moment(deposit.createdAt).format('MMMM DD, YYYY - dddd')
                            }
                        }) : 0
                    }
                }))
            })
            // .then(handler.respondWithResult(res))
            .catch(handler.handleError(res));
    },
    overview: function (req, res) {
        var userId = req.params.userId

        return Savings.find({ userId: userId })
            .populate('deposits')
            .exec()
            .then(handler.handleEntityNotFound(res))
            .then(wallets => {
                var totalDeposits = 0;
                wallets.map(wallet => {
                    var walletDeposits = 0;
                    wallet.deposits.forEach(deposit => {
                        if (deposit.period === cPeriod) {
                            walletDeposits = walletDeposits + deposit.amount
                            console.log(walletDeposits);
                        }
                    });
                    totalDeposits += walletDeposits;
                });
                var data = {
                    // userId: userId,
                    totalDeposits: totalDeposits
                }
                res.send(data);
            })
            // .then(handler.respondWithResult(res))
            .catch(handler.handleError(res));
    }

}
module.exports = controller;