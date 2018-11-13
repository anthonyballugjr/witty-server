

var controller = {
    home: function (req, res) {
        res.status(200).send({ Message: 'Hello Reindel', Test: 'Server Test', counter: counter })
    },
    postData: function (req, res) {
        var count = req.body.count;

        res.status(200).send(count);
        counter = 0;
        console.log(count);
    },
    feed: function (req, res) {
        res.send(counter);
    }
}

module.exports = controller;
