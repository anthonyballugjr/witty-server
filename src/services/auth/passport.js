var passport = require('passport');
var LocalStrategy = require('passport-local');

var Users = require('../../api/users/users.model');

passport.use(new LocalStrategy({
  usernameField: 'user[email]',
  passwordField: 'user[password]',
}, (email, password, done) => {
  Users.findOne({ email })
    .then((user) => {
      if (!user || !user.validatePassword(password)) {
        return done(null, false, 'Email or password is incorrect');
      }
      else if (user.activated === false || user.activated === undefined) {
        return done(null, false, 'Your account has not been verified. Check your email for account activation, if you are seeing this and you are one of our testers, kindly register again, DATABASE server has been reset.');
      }
      else {
        return done(null, user);
      }
    }).catch(done);
}));