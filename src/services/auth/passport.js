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
      return done(null, user);
    }).catch(done);
}));