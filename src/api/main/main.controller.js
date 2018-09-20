var config = require('../../config');

var controller = {
  home: function (req, res) {
    res.status(200).send({
      name: 'Witty Wallet Server',
      desc: 'Personal Finance Management Mobile App',
      by: 'Anthony Ballug Jr, Lysle Baday, Jonan Bie and Lyra Padua'
    });
  },
};


module.exports = controller;
