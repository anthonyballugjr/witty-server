var mongoose = require('mongoose');//require mongoose
var Users = require('../models/users');
var Schema = mongoose.Schema;//

var CategorySchema = new Schema({
        name: { type: String, required: true, lowercase: true },
        budget: { type: Number, required: true },
        expense: [
            {
                desc: { type: String, lowercase: true },
                amount: Number,
                date: Date
            },
        ],
        active: { type: Boolean, default: true },

    // _user: { type: Schema.Types.ObjectId, ref: Users },
    // budget: [
    //     {
    //         period: Date,
    //         name: { type: String, required: true, lowercase: true },
    //         budget: { type: Number, required: true },
    //         expense: [
    //             {
    //                 desc: { type: String, lowercase: true },
    //                 amount: Number,
    //                 date: Date
    //             }
    //         ],
    //         active: { type: Boolean, default: true }

    //     }]

});

module.exports = mongoose.model('Category', CategorySchema);
