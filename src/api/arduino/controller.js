var config = require('../../config');

var controller = {
    home: function (req, res) {
        res.status(200).json('Hello Reindel')
    }
}

module.exports = controller;
