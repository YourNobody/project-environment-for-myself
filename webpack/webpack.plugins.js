/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-extraneous-dependencies */
const webpack = require('webpack');
const TypescriptConfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const CaseSensitivePathsPlugin = require("case-sensitive-paths-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const {WatchIgnorePlugin, DefinePlugin, ProgressPlugin} = webpack;

const loadVuePlugin = () => {
  const { VueLoaderPlugin } = require('vue-loader');
  return VueLoaderPlugin;
};

module.exports = {
  TypescriptConfigPathsPlugin,
  WatchIgnorePlugin, DefinePlugin, ProgressPlugin,
  CaseSensitivePathsPlugin, HtmlWebpackPlugin,
  MiniCssExtractPlugin, CleanWebpackPlugin, CopyWebpackPlugin,
  loadVuePlugin
};