var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SavingSchema = new Schema({
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
    goal: {
        type: Number,
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

SavingSchema
    .virtual('deposits', {
        ref: 'Deposit',
        localField: '_id',
        foreignField: 'walletId',
        justOne: false,
        options: {
            sort: {
                date: 1
            },
        }
    });


SavingSchema
    .path('name')
    .validate(function (value) {
        return this.constructor.findOne({ name: this.name })
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

var validatePresenceOf = function (value) {
    return value && value.length;
};


module.exports = mongoose.model('Savings', SavingSchema);
