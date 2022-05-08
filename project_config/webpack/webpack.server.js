const { merge } = require('webpack-merge');
const {
  CleanWebpackPlugin, CopyWebpackPlugin, MiniCssExtractPlugin
} = require('./webpack.plugins');
const path = require('path');
const { removePlugin } = require('../common.helper');

/** @type {import('webpack').Configuration} */
const extendingWebpackConfig = {
  target: 'web',
  devServer: {
    hot: true,
    historyApiFallback: {
      rewrites: [
        { from: /favicon.ico/, to: "public/favicon.ico" },
      ],
    },
    stats: {
      children: false,
      modules: false,
    },
    contentBase: path.resolve(__dirname, './public'),
    watchContentBase: true,
  }
}

const defineDevServer = (webpackGeneralConfig) => {
  const { plugins } = webpackGeneralConfig;

  removePlugin(plugins, (plugin) => plugin instanceof CleanWebpackPlugin);
  removePlugin(plugins, (plugin) => plugin instanceof CopyWebpackPlugin);
  removePlugin(plugins, (plugin) => plugin instanceof MiniCssExtractPlugin);

  return merge(webpackGeneralConfig, extendingWebpackConfig);
};

module.exports = {
  defineDevServer
};
