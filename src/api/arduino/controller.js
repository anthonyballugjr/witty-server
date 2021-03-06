var arduinoSwitch;

var controller = {
    home: function (req, res) {
        res.status(200).send({ Message: 'Hello Reindel', Test: 'Server Test', arduino: arduinoSwitch })
    },
    postData: function (req, res) {
        var trigger = req.body.trigger;
        console.log(trigger);

        if (trigger === 'on') {
            arduinoSwitch = 'on';
            res.status(200).send({ arduino: 'on' });
        } else {
            arduinoSwitch = 'off';
            res.status(200).send({ arduino: 'off' });
        }
    },
    feed: function (req, res) {
        res.send(counter);
    }
}

module.exports = controller;
