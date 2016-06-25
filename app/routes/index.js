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


	app.post('/setStock' , function(req,res){

		if(req.body.stockSymbol == null){
			seeStocks();
		}else{

		Stock.findOne({symbol : req.body.stockSymbol.toUpperCase()} , function(err,stock){
			if(!stock){
				var newStock = new Stock({symbol : req.body.stockSymbol.toUpperCase()});
				newStock.save(function(err){
					if(err)throw err;
					Stock.find({symbol : req.body.stockSymbol.toUpperCase()} , function(err,stocks){
						if(stocks.length > 1){
							for(var i=1;i<stocks.length;i++){
								stocks[i].remove(function(){
									if(i==stocks.length){
										seeStocks();
									}
								});
							}
						}else{
							seeStocks();
						}
					});
				});
			}else{
				seeStocks();
			}
		});
	}

		function seeStocks(){
		var stockSymbolArr = [];
		Stock.find({} , function(err,stocks){
			if(err) throw err;
			stocks.forEach(function(stock){
				stockSymbolArr.push(stock.symbol);
				if(stockSymbolArr.length == stocks.length){
					res.send(stockSymbolArr);
				}
			});
		});
	}
	});

	app.post('/getStocks', function(req,res){
		var dataArr = [];
			req.body.stockArr.forEach(function(symbol){
				quandljs.getDataFromSymbol(symbol , function(data){
					dataArr.push(JSON.parse(data));
					if(dataArr.length == req.body.stockArr.length){
						res.send(dataArr);
					}
				});
			});
		});

		app.get('/delete' , function(req,res){
			Stock.find({} , function(err, stocks){
				stocks.forEach(function(stock){
					stock.remove();
				});
			});
		});


		io.on('connection', function(socket){
				socket.on('new stock', function(stock){
					io.emit('new stock', stock);
			});
				socket.on('remove stock', function(stock){
					Stock.findOne({symbol : stock}, function(err, stockObj){
						stockObj.remove(function(){
							io.emit('remove stock', stock);
						});
					});
				});
		});

	}
