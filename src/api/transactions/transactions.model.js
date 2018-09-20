var mongoose = require('mongoose');
// var Users = require('../models/users');
var Schema = mongoose.Schema;

var TransactionSchema = new Schema({
    desc: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true
    },
    walletId: {
        type: String,
        ref: 'Wallet'
    }
},
    {
        timestamps: true,
        id: false,
        versionKey: false,
        toJSON: {
            virtuals: true
        },
        toObject: {
            virtuals: true
        },
        options: {
            sort: {
                createdAt: 1
            }
        }

    });

module.exports = mongoose.model('Transaction', TransactionSchema);
