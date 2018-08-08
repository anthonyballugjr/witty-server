var mongoose = require('mongoose');
var config = require('../../config');

mongoose.connect(config.mongoUri, {
  useNewUrlParser: true
});
mongoose.set('debug', false);
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.once('open', function () {
  console.log('Database connected.');
});