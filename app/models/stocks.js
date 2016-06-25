var mongoose = require('mongoose');

var stockSchema = mongoose.Schema ({
  name : String,
  symbols : {type : Array , default : []}
});



var Stock = mongoose.model('Stock' , stockSchema);

Stock.find({}, function(err,stocks){
  if(!stocks){
    var myStock = new Stock({name : 'myOnlyStock'});
    myStock.save();
  }
});

module.exports = {Stock};
