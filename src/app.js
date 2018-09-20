var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var cors = require('cors');
var express = require('express');
var logger = require('morgan');
var path = require('path');
var session = require('express-session');

var config = require('./config');

var app = express();

app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session(config.session));

require('./services/mongoose');
require('./services/auth/passport');
require('./routes')(app);
require('./errors')(app);
require('./services/seeder')(config.seed);

module.exports = app;