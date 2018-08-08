var mongoose = require('mongoose');//require mongoose
var Schema = mongoose.Schema;//
var bcrypt = require('bcrypt-nodejs');
var jwt = require('jsonwebtoken');
var passportLocalMongoose = require('passport-local-mongoose');
var secret=require('../config/database').secret;

var UserSchema = new Schema({
    email: {
        type: String,
        lowercase: true,
        unique: true,
        //required: true
    },
    password: {
        type: String,
        //required: true
    },
    name: {
        type: String,
        default: 'Witty User'
    }
}, {
        timestamps: true
    });

UserSchema.pre('save', function (next) {
    var user = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, null, function (err, hash) {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});

// UserSchema.post('save', function (next) {
//     var user = this;
    
// });

UserSchema.methods.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

UserSchema.methods.generateJwt = function(){
    var expiry = new Date();
    expiry.setDate(expiry.getDate() + 30);

    return jwt.sign({
        _id: this.id,
        email: this.email,
        name: this.name,
        exp: parseInt(expiry.getTime()/1000),
    }, secret);
}

UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('User', UserSchema);
