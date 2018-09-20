var mongoose = require('mongoose');
// var Users = require('../models/users');
var Schema = mongoose.Schema;

var WalletSchema = new Schema({
    name: {
        type: String,
        required: true,
        lowercase: true
    },
    userId: {
        type: String,
        ref: 'User',
        required: true,
    },
    type: {
        type: String,
        required: true,
        lowercase: true
    },
    amount: {
        type: Number,
        required: true
    },
    categoryId: {
        type: String,
        ref: 'Category'
    },
    period: {
        type: String,
        required: true
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
        }
    });

WalletSchema
    .virtual('transactions', {
        ref: 'Transaction',
        localField: '_id',
        foreignField: 'walletId',
        justOne: false,
        options: {
            sort: {
                date: 1
            },
            // limit: 5
        }
    });

WalletSchema
    .virtual('category', {
        ref: 'Category',
        localField: 'categoryId',
        foreignField: '_id',
        justOne: false,
    });

WalletSchema
    .path('type')
    .validate(function (value) {
        return this.constructor.findOne({ type: value, name: this.name, period: this.period }).exec()
            .then(wallet => {
                if (wallet) {
                    if (this._id === wallet._id) {
                        return true;
                    }
                    return false;
                }
                return true;
            })
            .catch(function (err) {
                throw err;
            });
    }, 'Wallet name already exists in that type, please enter a new wallet name.');


module.exports = mongoose.model('Wallet', WalletSchema);
