'use strict';
var path = process.cwd();

module.exports = {init};
function init(app){

	app.route('/').get(function(req,res){
		res.render(path + '/views/index.pug');
	})

}
