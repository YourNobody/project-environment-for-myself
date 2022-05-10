const webpackGeneral = require('./webpack/webpack.general');
const {isProdMode} = require('./common.helper');
const {defineDevServer} = require('./webpack/webpack.server');

let webpack = null;

if (isProdMode()) {
	webpack = webpackGeneral;
} else {
	webpack = defineDevServer(webpackGeneral);
}

module.exports = webpack;