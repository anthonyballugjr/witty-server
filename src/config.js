var path = require('path');
var dotenv = require('dotenv-safe');

dotenv.config({
  allowEmptyValues: true,
  example: path.join(__dirname, '../.env.example')
});

dotenv.load({
  path: path.join(__dirname, '../.env'),
  sample: path.join(__dirname, '../.env.example')
});

function requireProcessEnv(name) {
  if (!process.env[name]) {
    console.log('You must set the ' + name + ' environment variable');
  }
  return process.env[name];
}

var config = {
  masterKey: requireProcessEnv('MASTER_KEY'),
  mongoUri: requireProcessEnv('MONGODB_URI'),
};

module.exports = config;