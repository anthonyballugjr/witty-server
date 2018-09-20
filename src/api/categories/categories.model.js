var mongoose = require('mongoose');
// var Users = require('../models/users');
var Schema = mongoose.Schema;

var CategorySchema = new Schema({
  _id: {
    type: String,
    lowercase: true,
  },
  desc: {
    type: String,
    lowercase: true,
  },
  icon: {
    type: String,
    lowercase: true
  }

},
  {
    id: false,
    versionKey: false,
    toJSON: {
      virtuals: true
    },
    toObject: {
      virtuals: true
    }
  });

CategorySchema
  .virtual('wallets', {
    ref: 'Wallet',
    localField: '_id',
    foreignField: 'categoryId',
    justOne: false
  });

module.exports = mongoose.model('Category', CategorySchema);
