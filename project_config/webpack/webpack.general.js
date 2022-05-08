const path = require('path');
const minifyCssClassNames = require("mini-css-class-name/css-loader");
const {webpackFilename, resolveExtensions, low, isDevMode, isProdMode} = require('../common.helper');
const {TypescriptConfigPathsPlugin, WatchIgnorePlugin, DefinePlugin, CaseSensitivePathsPlugin,
  HtmlWebpackPlugin, CleanWebpackPlugin, CopyWebpackPlugin, ProgressPlugin, MiniCssExtractPlugin
} = require('./webpack.plugins');

const srcDirPath = path.resolve(__dirname, './src/');
const distDirPath = path.resolve(__dirname, './dist/');
const assetsDirPath = path.resolve(__dirname, './public');

function defineGetLocalIdent() {
  if (isProdMode()) return minifyCssClassNames({
    excludePattern: /[_dD]/gi
  });
  return (loaderContext, _localIdentName, localName, options) => {
    const request = path
      .relative(options.context || "", loaderContext.resourcePath)
      .replace(`src${path.sep}`, "")
      .replace(".module.css", "")
      .replace(".module.scss", "")
      .replace(/\\|\//g, "-")
      .replace(/\./g, "_");
    return `${request}__${localName}`;
  };
}

/** @type {import('webpack').StatsOptions} */
const stats = {
  children: false,
  modules: false,
  error: true,
  errorDetails: true
};

/** @type {import('webpack').Output} */
const output = {
  path: distDirPath,
  filename: webpackFilename('js'),
  chunkFilename: webpackFilename('js'),
  publicPath: '/'
};

/** @type {import('webpack').ResolveOptionsWebpackOptions} */
const resolve = {
  extensions: resolveExtensions('js', 'jsx', 'ts', 'tsx'),
  plugins: [
    new TypescriptConfigPathsPlugin({
      configFile: './tsconfig.json'
    })
  ]
};

/** @type {import('webpack').Plugin[]} */
const plugins = [
  new WatchIgnorePlugin({ paths: [/\.d\.ts$/] }),
  new DefinePlugin({
    'process.env': {
      NODE_ENV: low(process.env.NODE_ENV),
      BASE_URL: '/',
    },
    'global.IS_DEV': JSON.stringify(isDevMode())
  }),
  new CaseSensitivePathsPlugin(),
  new HtmlWebpackPlugin({
    template: path.resolve(srcDirPath, "index.html"),
    minify: isProdMode() && {
      removeComments: true,
      collapseWhitespace: true,
      removeAttributeQuotes: true,
      collapseBooleanAttributes: true,
      removeScriptTypeAttributes: true
    }
  }),
  new MiniCssExtractPlugin({
    filename: webpackFilename('css'),
    chunkFilename: webpackFilename('css', null, 'id')
  }),
  new CleanWebpackPlugin(),
  new CopyWebpackPlugin({
    patterns: [{
      from: assetsDirPath,
      to: distDirPath,
      toType: "dir",
    }]
  }),
  new ProgressPlugin()
];

/** @type {import('webpack').Optimization} */
const optimization = {
  splitChunks: {
    minChunks: 1,
    cacheGroups: {
      defaultVendors: {
        name: "chunk-vendors",
        test: /[\\/]node_modules[\\/]/,
        priority: -10,
        chunks: "initial",
      },
      common: {
        name: "chunk-common",
        minChunks: 2,
        priority: -20,
        chunks: "initial",
        reuseExistingChunk: true,
      },
    },
  },
};

/** @type {import('webpack').RuleSetRule[]} */
const rules = [{
  test: /\.(ts|tsx)$/,
  exclude: /node_modules/,
  use: [
    "babel-loader",
    {
      loader: "ts-loader",
      options: {
        transpileOnly: true,
      },
    },
  ]}, {
  test: /\.(js|jsx)$/,
  exclude: /node_modules/,
  use: ['babel-loader'],
  }, {
  test: /\.(png|jpe?g|gif|webp)(\?.*)?$/,
  exclude: /(node_modules)/,
  use: [
    {
      loader: "url-loader",
      options: {
        name: "images/[name].[ext]",
      },
    },
  ]}, {
  test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
  use: [
    {
      loader: "url-loader",
      options: {
        name: "fonts/[name].[ext]"
      },
    },
  ]}, {
  test: /\.css$|\.scss$/,
  use: [isProdMode() ? MiniCssExtractPlugin.loader : 'style-loader', {
    loader: "css-loader",
    options: {
      modules: {
        auto: /\.module\.\w+$/,
        getLocalIdent: defineGetLocalIdent()
      },
    },
  }, {
    loader: "sass-loader",
    options: {
      additionalData: '@import "variables";',
      sassOptions: {
        includePaths: [path.resolve(__dirname, "src/styles")],
      },
    },
  }, 'postcss-loader']
}];

/** @type {import('webpack').ModuleOptions} */
const module = {
  rules
};


/** @type {import('webpack').Configuration} */
const webpackGeneralConfig = {
  entry: path.resolve(srcDirPath, 'root.(js|ts)'),
  output, resolve, plugins, stats, optimization, module
};

module.exports = webpackGeneralConfig;