var mongoose = require('mongoose');

var stockSchema = mongoose.Schema ({
  symbol : String,
});



var Stock = mongoose.model('Stock' , stockSchema);

module.exports = {Stock};
