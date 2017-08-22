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
			// 专门配置一个babel-loader来编译koa-cola，因为koa-cola没有经过完整的编译，只是简单的es module，ts等transform
			// 原因见：https://github.com/hcnode/koa-cola#server
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
		// 以下两个是给服务器端使用，不能打包到webpack
		new webpack.IgnorePlugin(/\.\/src\/app/),
		new webpack.IgnorePlugin(/\.\/src\/util\/injectGlobal/),
		// 以下两个是controller引用的，也是服务器端使用，也不能打包到webpack，如果你的controller也有服务器端使用的库，也必须要加IgnorePlugin插件
		new webpack.IgnorePlugin(/koa$/),
		new webpack.IgnorePlugin(/koa-body$/),
		// 分析bundle构成
		// new webpack.IgnorePlugin(/^mongoose-class-wrapper$/)
		/* new (require('webpack-bundle-analyzer').BundleAnalyzerPlugin)({
			// Can be `server`, `static` or `disabled`. 
			// In `server` mode analyzer will start HTTP server to show bundle report. 
			// In `static` mode single HTML file with bundle report will be generated. 
			// In `disabled` mode you can use this plugin to just generate Webpack Stats JSON file by setting `generateStatsFile` to `true`. 
			analyzerMode: 'server',
			// Host that will be used in `server` mode to start HTTP server. 
			analyzerHost: '127.0.0.1',
			// Port that will be used in `server` mode to start HTTP server. 
			analyzerPort: 8888,
			// Path to bundle report file that will be generated in `static` mode. 
			// Relative to bundles output directory. 
			reportFilename: 'report.html',
			// Module sizes to show in report by default. 
			// Should be one of `stat`, `parsed` or `gzip`. 
			// See "Definitions" section for more information. 
			defaultSizes: 'parsed',
			// Automatically open report in default browser 
			openAnalyzer: true,
			// If `true`, Webpack Stats JSON file will be generated in bundles output directory 
			generateStatsFile: false,
			// Name of Webpack Stats JSON file that will be generated if `generateStatsFile` is `true`. 
			// Relative to bundles output directory. 
			statsFilename: 'stats.json',
			// Options for `stats.toJson()` method. 
			// For example you can exclude sources of your modules from stats file with `source: false` option. 
			// See more options here: https://github.com/webpack/webpack/blob/webpack-1/lib/Stats.js#L21 
			statsOptions: null,
			// Log level. Can be 'info', 'warn', 'error' or 'silent'. 
			logLevel: 'info'
		}), */

	],
	// When importing a module whose path matches one of the following, just
	// assume a corresponding global variable exists and use that instead.
	// This is important because it allows us to avoid bundling all of our
	// dependencies, which allows browsers to cache those libraries between builds.
	externals: {
		// 'react': 'React',
		// 'react-dom': 'ReactDOM'
	},
};