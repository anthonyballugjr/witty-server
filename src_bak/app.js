//dependencies
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var passportConfig=require('./config/passport');

var sassMiddleware = require('node-sass-middleware');

var config = require('./config/database');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var api = require('./routes/api');
// var api = require('./controllers/users');

var seed = require('./config/seed');
var mongoose = require('mongoose');
var cors = require('cors');

var categories = require('./controllers/categories');
var User = require('./models/users');

var app = express();
app.use(cors());

//xx
mongoose.connect('mongodb://localhost:27017/wittywallet-dev', { useNewUrlParser: true });
//connection string
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.once('open', function () {
  console.log('Database Connection Successful!');
});
//xx

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

// app.use(require('express-session')({
//   secret: config.secret,
//   resave: false,
//   saveUninitialized: false,
//   cookie: {
//     expires: 3600 * 24 * 30
//   }
// }));
//xx
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(passport.initialize());
app.use(passport.session());


//xx

app.use('/', indexRouter);
// app.use('/users', users);
app.use('/categories', categories);
app.use('/auth', api);

// passport config
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
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

seed.seed();

module.exports = app;
