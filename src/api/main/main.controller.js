var config = require('../../config');

var controller = {
  home: function (req, res) {
    res.status(200).send({
      name: 'Witty Wallet',
    });
  },
};

module.exports = controller;
