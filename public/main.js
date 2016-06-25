$(document).ready(function(){

  var stockSymbolArr = [];

  var socket = io();
  $('form').submit(function(){
    socket.emit('new stock', $('input').val());
    $('input').val('');
    return false;
  });
  socket.on('new stock', function(stock){
    stockSymbolArr.push(stock);
    updateStocks(stockSymbolArr);
  });

  updateStocks(stockSymbolArr);

  function updateStocks(stockArr){

    //Give server the stock symbols and retrieve the data
   $.post("/getStocks", {stockSymbols : stockArr} , function(StockData){
     var dataArr =[];
     //Set up dataArr
     StockData.forEach(function(Stock){
       var dataPointsArr = [];
       Stock.dataset.data.forEach(function(priceAtTime){
         dataPointsArr.push({ x : new Date(priceAtTime[0]) , y: priceAtTime[1]});
       });
       dataArr.push({showInLegend : true,
                     legendText : Stock.dataset.dataset_code ,
                     type: "line",
                     dataPoints: dataPointsArr});
     });

     //Create the Chart
     var chart = new CanvasJS.Chart("chartContainer",
       {
        axisX: {
          interval:20,
          intervalType: "day"
      },
        axisY:{
          prefix : '$'
      },
        data: dataArr
      });
       chart.render();
      });
    }
    //end of updateStocks

});
