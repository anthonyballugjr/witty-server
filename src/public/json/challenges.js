module.exports = {
    createChallenge: function (id) {
        var xid = id;
        return [{
            title: '31-Day Challenge',
            description: 'Some saving challenges take too long to finish so people have a hard time sticking to them. This challenge provides a short-term goal to encourage saving.',
            expectedAmount: 620,
            incrementBy: 20,
            length: 31,
            count: 'day',
            type: 'static',
            active: false,
            completed: false,
            current: 0,
            progress: 0,
            userId: xid
        },
        {
            title: '52-Week Challenge',
            description: 'This challenge involves saving an increasing amount each week until the end of the year. This version of the challenge starts at PHP 5 and has a weekly increment of PHP 5 each week.',
            expectedAmount: 6890,
            incrementBy: 5,
            length: 52,
            count: 'week',
            type: 'incremental',
            active: false,
            completed: false,
            current: 0,
            progress: 0,
            userId: xid
        }]
    }
}
