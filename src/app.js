var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var mongoose = require('mongoose');
var cors = require('cors');
var routes = require('./routes');

var seedDatabase = require('./services/seeder');
var config = require('./config');

var app = express();
app.use(cors());

mongoose.promise = global.Promise;

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'wittywallet',
  cookie: {
    maxAge: 60000
  },
  resave: false,
  saveUninitialized: false
}));

require('./services/mongoose');
require('./services/auth/passport');
routes(app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
  
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).send('Unauthorized Access');
  }
});
  
// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

seedDatabase(true);

module.exports = app;