var Deposit = require('./deposits.model');
var handler = require('../../services/handler');
var moment = require('moment');


var controller = {
    getEntries: function (req, res) {
        var walletId = req.query.walletId;

        return Deposit.find(walletId ? { walletId: walletId } : {})
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
            .then((deposits) => {
                res.status(200).send(deposits.map(deposit => {
                    return {
                        _id: deposit._id,
                        amount: deposit.amount,
                        period: deposit.period,
                        createdAt: moment(deposit.createdAt).format('MMMM DD, YYYY - dddd, hh:mm A')
                    };
                }));
            })
            .catch(handler.handleError(res));
    },
    getEntry: function (req, res) {
        return Deposit.findById(req.params.id)
            .exec()
            .then(handler.handleEntityNotFound(res))
            .then((deposit) => {
                res.status(200).send({
                    _id: deposit._id,
                    amount: deposit.amount,
                    createdAt: moment(Deposit.createdAt).format('MMMM DD, YYYY - dddd, hh:mm A')
                })
            })
            // .then(handler.respondWithResult(res))
            .catch(handler.handleError(res));
    },
    getMyDeposits: function (req, res) {
        var userId = req.params.user
        return Deposit.find({ user: user })
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
        return Deposit.create(req.body)
            .then(handler.respondWithResult(res, 201))
            .catch(handler.handleError(res));
    },
    update: function (req, res) {
        if (req.body._id) {
            Reflect.deleteProperty(req.body, '_id');
        }
        return Deposit.findByIdAndUpdate(req.params.id, req.body, {
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
        return Deposit.findByIdAndRemove(req.params.id).exec()
            .then(handler.handleEntityNotFound(res))
            .then(handler.respondWithResult(res, 204))
            .catch(handler.handleError(res));
    }
};

module.exports = controller;