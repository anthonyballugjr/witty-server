var fs = require('fs');
var path = require('path');

// var Categories = require('./seed.categories');
var Categories = require('../../api/categories/categories.model');

function readStream(dir, file) {
  dir = (dir !== 'default') ? dir : '../../public/csv/';
  if (file) {
    return fs.createReadStream(
      path.join(__dirname, dir, file)
    );
  } else {
    console.log('Directory does not exists');
    return null;
  }
}

function seedJSON(document, data) {
  document.find().remove()
    .then(() => {
      document.create(data)
        .then(() => {
          console.log('Successfuly Seeded!');
        }).catch(err => {
          console.log(err);
        });
    }).catch(err => {
      console.log(err);
    });
}

module.exports = function (seedIfNeeded) {
  // var categoriesCSV = readStream('default', 'categories.csv');
  if (seedIfNeeded) {
    // Categories(categoriesCSV);
    seedJSON(Categories, require('./seed.categoriesJSON'))
  }
};