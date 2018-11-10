

var controller = {
    home: function (req, res) {
        res.status(200).send({ Message: 'Hello Reindel' })
    }
}

module.exports = controller;
