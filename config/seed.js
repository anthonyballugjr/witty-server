var Categories = require('../models/categories'); //use models/categories

var categoryEntry = [
    {
        name: 'Food',
        budget: 5000,
        expense: [
            {
                desc: 'groceries',
                amount: 1300,
                date: new Date()
            },
            {
                desc: 'dined at mcdo',
                amount: 200,
                date: new Date()
            },
            {
                desc: 'lunch',
                amount: 40,
                date: new Date()
            }

        ]
    },
    {
        name: 'Education',
        budget: 4000,
        expense: [
            {
                desc: 'tuition fee',
                amount: 3000,
                date: new Date()
            },
            {
                desc: 'math book',
                amount: 140,
                date: new Date()
            }
        ]
    },
    {
        name: 'Health Care',
        budget: 3000,
        expense: [
            {
                desc: 'meds',
                amount: 300,
                date: new Date()
            },
            {
                desc: 'checkup',
                amount: 100,
                date: new Date()
            }
        ]
    },
    {
        name: 'Car',
        budget: 1500,
        expense: [
            {
                desc: 'maintenance',
                amount: 500,
                date: new Date()
            }
        ]
    }
];

module.exports = {
    seed: function () {

        Categories.find().remove()
            .then(() => {
                Categories.create(categoryEntry)
                    .then(() => {
                        console.log('Budget Seeded!');
                    }).catch(err => {
                        console.log(err);
                    });
            }).catch(err => {
                console.log(err);
            });
    }
};