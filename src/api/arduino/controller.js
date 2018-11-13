const data = 0;

var controller = {
    home: function (req, res) {
        res.status(200).send({ Message: 'Hello Reindel', Test: 'Server Test', data: data })
    },
    postData: function (req, res) {
        var count = req.body.count;
        data = parseInt(count); 

        res.status(200).send({count: data});
        console.log(count);
    },
    feed: function (req, res) {
        res.send(counter);
    }
}

module.exports = controller;
