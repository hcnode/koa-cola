module.exports = function(koaApp){
	koaApp.proxy = true;
	app.mongoose.Promise = global.Promise;
	if(process.env.NODE_ENV != 'test'){
		app.mongoose.connect(app.config.mongodb); 
	}
};