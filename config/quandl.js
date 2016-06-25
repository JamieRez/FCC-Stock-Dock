var Quandl = require('quandl');
var quandl = new Quandl({
    auth_token: "AWEQQwN34hgxW_WBRMG5",
    api_version: 3,
});

function getDataFromSymbol(Symbol , Cb){

    quandl.dataset({
      source: "WIKI",
      table: Symbol
    }, {
      order: "asc",
      exclude_column_names: true,
      // Notice the YYYY-MM-DD format
      start_date: "2016-01-01",
      column_index: 4
    }, function(err, response){
        if(err)
            throw err;

        Cb(response);
    });
  }


module.exports = {getDataFromSymbol};
