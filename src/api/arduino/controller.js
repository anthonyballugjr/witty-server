var counter = 0;

var controller = {
    home: function (req, res) {
        res.status(200).send({ Message: 'Hello Reindel', Test: 'Server Test' })
    },

    count: function (req, res) {
        var count = req;

        if (count === 10) counter = 10;
        res.status(200).send(counter);
        console.log(counter);
    },
    feed: function (req, res) {
        res.status(200).send(counter);
    }
}

module.exports = controller;
