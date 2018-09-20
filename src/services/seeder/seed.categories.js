var csv = require('fast-csv');

var Categories = require('../../api/categories/categories.model');

module.exports = function (stream) {
  var entries = [];
  return csv
    .fromStream(stream, {
      headers: true,
      ignoreEmpty: true
    })
    .on('data', function (data) {
      entries.push({
        name: data['name'],
        budget: data['budget'],
        expense: { desc: data['expense'], amount: 593, date: Date.now() }
      });
    })
    .on('end', function () {
      Categories.find().remove()
        .then(() => {
          console.log('Finished purging \'categories\' collection')
          Categories.create(entries)
            .then(() => console.log('Finished populating \'categories\' collection'))
            .catch(err => console.log('Error seeding', err));
        }).catch(err => console.log('Error purging', err));
    });
}