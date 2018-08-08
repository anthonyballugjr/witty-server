var passport = require('passport');
var User = require('../models/users');
var config = require('./database');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy({
    usernameField: 'email'
}, function(username, password, done){
    User.findOne({email:username}, function(err,user){
        if(err){
            return done(err);
        }
        //return if user not found in database
        return done(null, user);
    })
}))