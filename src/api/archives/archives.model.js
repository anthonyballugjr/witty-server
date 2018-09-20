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
    totalSavings: {
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

module.exports = mongoose.model('Archive', ArchiveSchema);