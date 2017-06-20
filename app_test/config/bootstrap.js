module.exports = function(koaApp){
	koaApp.proxy = true;
	require('mongoose').Promise = global.Promise;
};