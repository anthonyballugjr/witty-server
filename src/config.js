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
  session: {
    secret: 'wittywallet',
    cookie: {
      maxAge: 60000
    },
    resave: false,
    saveUninitialized: false
  },
  seed: true,
  masterKey: requireProcessEnv('MASTER_KEY'),
  mongoUri: requireProcessEnv('MONGODB_URI')
};

module.exports = config;