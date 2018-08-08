var expressAccessToken = require('express-access-token');
var config = require('./config');

var masterKey = function (req, res, next) {
  var accessTokens = config.masterKey;
  var authorized = accessTokens.includes(req.accessToken);
  if (!authorized) return res.status(403).send('Forbidden');
  next();
};

module.exports = function (app) {
  app.use('/', require('./api/main'));
  // app.use('/api/auth', require('./api/auth/auth'));
  // app.use('/api/events', expressAccessToken, masterKey, require('./api/events'));
};