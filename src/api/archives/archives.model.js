var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ArchiveSchema = new Schema({
    userId: {
        type: String,
        ref: 'User'
    },
    period: {
        type: String,
        required: true,
    },
    totalBudget: {
        type: Number,
        required: true
    },
    totalExpenses: {
        type: Number,
        required: true
    },
    totalDeposits: {
        type: Number,
        required: true
    },
    extraSavings: {
        type: Number,
        required: true
    }
},
    {
        timestamps: true,
        id: false,
        versionKey: false,
        toJSON: {
            virtuals: true,
        },
        toObject: {
            virtuals: true
        }
    });

ArchiveSchema
    .path('period')
    .validate(function (value) {
        return this.constructor.findOne({ period: this.period, userId: this.userId })
            .exec()
            .then(archive => {
                if (archive) {
                    if (this._id === archive._id) {
                        return true;
                    }
                    return false;
                }
                return true;
            })
            .catch(function (err) {
                throw err;
            });
    }, 'Data already exists for that period!');

module.exports = mongoose.model('Archive', ArchiveSchema);