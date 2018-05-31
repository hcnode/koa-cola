const webpack = require('webpack');

module.exports = {
	entry: ['babel-polyfill', './views/app.tsx'],
	output: {
		filename: 'bundle.js',
		path: __dirname + '/public'
	},

	// Enable sourcemaps for debugging webpack's output.
	devtool: 'source-map',

	resolve: {
		// Add '.ts' and '.tsx' as resolvable extensions.
		extensions: ['.ts', '.tsx', '.js', '.json']
	},

	module: {
		rules: [
			// All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
			{ test: /\.tsx?$/, 
				use : {
					loader: 'awesome-typescript-loader',
					options : {
						useBabel : true,
					}
				}
			},
			// 专门配置一个babel-loader来编译koa-cola，因为koa-cola的ts编译的选项是ES2017，原因是服务器端使用不经过编译的async/awai
			{
				test: /\.jsx?$/,
				use: {
					loader: 'babel-loader'
				},
				exclude: /node_modules\/(?!(koa-cola)|(controller-decorators)\/).*/,
			},

			// All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
			{ enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' }
		]
	},

	plugins: [
		new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /zh-cn/),
	]
};