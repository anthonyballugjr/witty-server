var counter = 0;

var controller = {
    home: function (req, res) {
        res.status(200).send({ Message: 'Hello Reindel', Test: 'Server Test', counter: counter })
    },
    count: function (req, res) {
        var count = req;

        if (count === 10) counter = 10;
        res.status(200).send(counter);
        counter = 0;
        console.log(counter);
    },
    feed: function (req, res) {
        res.send(counter);
    }
}

module.exports = controller;
