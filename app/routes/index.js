'use strict';
var path = process.cwd();
var quandljs = require('../../config/quandl.js');
var Stock = require('../models/stocks.js').Stock;

module.exports = {init};
function init(app , io){

	app.route('/').get(function(req,res){
		res.render(path + '/views/index.pug');
	});

	app.route('/stock/:symbol').get(function(req,res){
		quandljs.getDataFromSymbol(req.params.symbol , function(data){
			var stockData = JSON.parse(data);
			res.send(stockData);
		});
	});

	app.post('/getStocks', function(req,res){

			Stock.findOne({name : 'myOnlyStock'} , function(err, myStock){
				if(err) throw err;
				if(req.body.stockSymbols != undefined){
				req.body.stockSymbols.forEach(function(stockSymbol){
					console.log(myStock);
					myStock.symbols.push(stockSymbol);
					myStock.save();
				});
			}


		var dataArr = [];
			if(myStock != undefined){
			myStock.symbols.forEach(function(symbol){
				quandljs.getDataFromSymbol(symbol , function(data){
					dataArr.push(JSON.parse(data));
					if(dataArr.length == req.body.stockSymbols.length){
						res.send(dataArr);
					}
				});
			});
		}
		});

		});


		io.on('connection', function(socket){
				socket.on('new stock', function(stock){
					console.log('Adding Stock: ' + stock);
					io.emit('new stock', stock);
			});
		});

	}
