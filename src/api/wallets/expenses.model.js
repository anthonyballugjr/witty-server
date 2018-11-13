var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ExpenseSchema = new Schema({
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

ExpenseSchema
    .virtual('transactions', {
        ref: 'Transaction',
        localField: '_id',
        foreignField: 'walletId',
        justOne: false,
        options: {
            sort: {
                date: 1
            },
        }
    });

ExpenseSchema
    .virtual('category', {
        ref: 'Category',
        localField: 'categoryId',
        foreignField: '_id',
        justOne: false,
    });

ExpenseSchema
    .path('period')
    .validate(function (value) {
        return this.constructor.findOne({ period: value, name: this.name })
            .exec()
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
    }, 'Wallet already exists, please enter a new wallet name.');


module.exports = mongoose.model('Expense', ExpenseSchema);
