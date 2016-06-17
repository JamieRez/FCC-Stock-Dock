var path = process.cwd();
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var port = process.env.PORT || 3000;
var morgan       = require('morgan');
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var session      = require('express-session');
var configDB = require('./config/database.js');
var pug = require('pug');


mongoose.connect(configDB.url, function(){
    console.log('database connected');
});

app.use(bodyParser());
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser());


app.use(express.static('./public'));
app.use(express.static('./views'));

var routes = require('./app/routes/index.js');
routes.init(app);

app.listen(port, function(req,res){
    console.log("Listening on port " + port);
});
