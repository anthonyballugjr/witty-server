var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ChallengeSchema = new Schema({
  title: { type: String, required: true},
  description: { type: String, required: true },
  expectedAmount: { type: Number, required: true },
  incrementBy: { type: Number, required: true },
  length: { type: Number, required: true },
  count: { type: String, required: true, lowercase: true },
  type: { type: String, required: true, lowercase: true },
  active: { default: false, type: Boolean },
  completed: { default: false, type: Boolean },
  current: { default: 0, type: Number },
  progress: { default: 0, type: Number },
  userId: { type: String, required: true, ref: 'User' }
}, {
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

module.exports = mongoose.model('Challenge', ChallengeSchema);