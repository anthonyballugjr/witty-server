var data = 0;

var controller = {
    home: function (req, res) {
        res.status(200).send({ Message: 'Hello Reindel', Test: 'Server Test', data: data })
    },
    postData: function (req, res) {
        var count = req.body.count;
        data = count;

        res.status(200).send({count: data});
        counter = 0;
        console.log(count);
    },
    feed: function (req, res) {
        res.send(counter);
    }
}

module.exports = controller;
