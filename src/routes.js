var config = require('./config');

var masterKey = function (req, res, next) {
  var accessTokens = config.masterKey;
  var authorized = accessTokens.includes(req.headers['access-token']);
  if (!authorized) return res.status(403).send('Forbidden Access');
  next();
};

module.exports = function (app) {
  app.use('/', require('./api/main'));
  app.use('/api/users', require('./api/users'));
  app.use('/api/wallets', require('./api/wallets'));
  app.use('/api/archives', require('./api/archives'))
  app.use('/api/categories', require('./api/categories'));
  app.use('/api/transactions', require('./api/transactions'));
  app.use('/api/deposits', require('./api/deposits'));
  app.use('/api/reports', require('./api/reports'));
  app.use('/api/challenge', require('./api/challenge'));

  // app.use('/api/articles', masterKey, require('./api/articles'));
  // app.use('/api/users', expressAccessToken, masterKey, require('./api/users'));
};