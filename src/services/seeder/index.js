var fs = require('fs');
var path = require('path');

var Categories = require('./seed.categories');

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

module.exports = function (seedIfNeeded) {
  var categoriesCSV = readStream('default', 'categoriesCSV.csv');
  if (seedIfNeeded) {
    Categories(categoriesCSV);
  }
};