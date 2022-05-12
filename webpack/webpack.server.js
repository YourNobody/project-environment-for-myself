/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const {merge} = require('webpack-merge');
const {
	CleanWebpackPlugin, CopyWebpackPlugin, MiniCssExtractPlugin
} = require('./webpack.plugins');
const {removePlugin, low} = require('./common.helper');
const packageJson = require('../package.json');

/** @type {import('webpack').Configuration} */
const extendingWebpackConfig = {
	target: 'web',
	devServer: {
		port: 3000,
		hot: true,
		historyApiFallback: {
			rewrites: [
				{from: /favicon.ico/, to: 'public/favicon.ico'}, // provide favicon
			]
		},
		open: true,
		proxy: {
			context: ['/'],
			'/': {
				target: packageJson.proxy || 'http://localhost:7777',
				bypass(req, res, proxyOptions) {
					const { originalUrl: orgUrl } = req;
					if (low(orgUrl).indexOf('favicon.ico') > -1 || low(orgUrl).indexOf('hot-update.json') > -1) {
						return req.originalUrl;
					}
					if (req.headers.accept.indexOf('text/html') !== -1) {
						return '/index.html';
					}
				},
			},
			changeOrigin: true,
			withCredentials: true,
			secure: false,
			logLevel: 'debug'
		},
		static: {
			directory: path.resolve(__dirname, '../public'),
			watch: true
		}
	}
};

const defineDevServer = (webpackGeneralConfig) => {
	const {plugins} = webpackGeneralConfig;

	removePlugin(plugins, (plugin) => plugin instanceof CleanWebpackPlugin);
	removePlugin(plugins, (plugin) => plugin instanceof CopyWebpackPlugin);
	removePlugin(plugins, (plugin) => plugin instanceof MiniCssExtractPlugin);

	return merge(webpackGeneralConfig, extendingWebpackConfig);
};

module.exports = {
	defineDevServer
};
