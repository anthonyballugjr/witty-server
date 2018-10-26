var mongoose = require('mongoose');
// var Users = require('../models/users');
var Schema = mongoose.Schema;

var DepositSchema = new Schema({
    amount: {
        type: Number,
        required: true
    },
    walletId: {
        type: String,
        ref: 'Savings'
    },
    period: String
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

module.exports = mongoose.model('Deposits', DepositSchema);
