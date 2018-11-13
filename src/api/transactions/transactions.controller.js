var Transaction = require('./transactions.model');
var handler = require('../../services/handler');
var moment = require('moment');


var controller = {
    getEntries: function (req, res) {
        var walletId = req.query.walletId;

        return Transaction.find(walletId ? { walletId: walletId } : {})
            // .populate('first model', 'fields or minus fields')
            // .populate({ path: 'user', select: 'name' })
            // .populate({
            //     path: 'second model',
            //     select: 'field from second model',
            //     populate: { //nest from second model
            //         path: '',
            //         select: ''
            //     }
            // })
            // .select('-__v')
            .exec()
            .then(handler.handleEntityNotFound(res))
            .then((transactions) => {
                
                res.status(200).send(transactions.map(transaction => {
                    var today = moment().format('MMMM DD, YYYY');
                    return {
                        _id: transaction._id,
                        desc: transaction.desc,
                        amount: transaction.amount,
                        createdAt: (moment(transaction.createdAt).format('MMMM DD, YYYY') === today) ? `Today - ${moment(transaction.createdAt).format('hh:mm A')}` : moment(transaction.createdAt).format('MMMM DD, YYYY - dddd, hh:mm A')
                    };
                }));
            })
            .catch(handler.handleError(res));
    },
    getEntry: function (req, res) {
        return Transaction.findById(req.params.id)
            .exec()
            .then(handler.handleEntityNotFound(res))
            .then((transaction) => {
                res.status(200).send({
                    _id: transaction._id,
                    desc: transaction.desc,
                    amount: transaction.amount,
                    createdAt: moment(transaction.createdAt).format('MMMM DD, YYYY - dddd, hh:mm A')
                })
            })
            // .then(handler.respondWithResult(res))
            .catch(handler.handleError(res));
    },
    getMyTransactions: function (req, res) {
        var user = req.params.user
        return Transaction.find({ user: user })
            .exec()
            .then(handler.handleEntityNotFound(res))
            // .then((datas) => {
            //     res.status(200).send({
            //         id: datas._id,
            //         name: datas.name
            //     })
            // })
            .then(handler.respondWithResult(res))
            .catch(handler.handleError(res));
    },
    create: function (req, res) {
        return Transaction.create(req.body)
            .then(handler.respondWithResult(res, 201))
            .catch(handler.handleError(res));
    },
    update: function (req, res) {
        if (req.body._id) {
            Reflect.deleteProperty(req.body, '_id');
        }
        return Transaction.findByIdAndUpdate(req.params.id, req.body, {
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
        return Transaction.findByIdAndRemove(req.params.id).exec()
            .then(handler.handleEntityNotFound(res))
            .then(handler.respondWithResult(res, 204))
            .catch(handler.handleError(res));
    }
};

module.exports = controller;