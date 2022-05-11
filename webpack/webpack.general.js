/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const fs = require('fs');
const minifyCssClassNames = require("mini-css-class-name/css-loader");
const {webpackFilename, resolveExtensions, isDevMode, isProdMode, insertBefore} = require('./common.helper');
const {TypescriptConfigPathsPlugin, WatchIgnorePlugin, DefinePlugin, CaseSensitivePathsPlugin,
  HtmlWebpackPlugin, CleanWebpackPlugin, CopyWebpackPlugin, ProgressPlugin, MiniCssExtractPlugin, VueLoaderPlugin
} = require('./webpack.plugins');

const srcDirPath = path.resolve(__dirname, '../src/');
const distDirPath = path.resolve(__dirname, '../dist/');
const assetsDirPath = path.resolve(__dirname, '../public');

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
  errorDetails: true
};

/** @type {import('webpack').Output} */
const output = {
  path: distDirPath,
  filename: webpackFilename('js'),
  chunkFilename: webpackFilename('js'),
  publicPath: isProdMode() ? './' : '/'
};

/** @type {import('webpack').ResolveOptionsWebpackOptions} */
const resolve = {
  extensions: resolveExtensions('js', 'jsx', 'ts', 'tsx'),
  plugins: [
    new TypescriptConfigPathsPlugin({
      configFile: path.resolve(__dirname, '..//tsconfig.json')
    })
  ]
};

/** @type {import('webpack').Plugin[]} */
const plugins = [
  new WatchIgnorePlugin({ paths: [/\.d\.ts$/] }),
  new DefinePlugin({
    'process.env': {
      BASE_URL: isProdMode() ? '"./"' : '"/"',
    },
    'global.IS_DEV': JSON.stringify(isDevMode())
  }),
  new CaseSensitivePathsPlugin(),
  new HtmlWebpackPlugin({
    template: path.resolve(srcDirPath, 'index.html'),
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
const rules = [
  {
    test: /\.(ts|tsx)$/,
    exclude: /node_modules/,
    use: [
      'babel-loader',
      {
        loader: 'ts-loader',
        options: {
          transpileOnly: true,
        },
      },
    ]
  },
  {
    test: /\.(js|jsx)$/,
    exclude: /node_modules/,
    use: ['babel-loader'],
  },
  {
    test: /\.(png|jpe?g|gif|webp)(\?.*)?$/,
    exclude: /(node_modules)/,
    use: [
      {
        loader: 'url-loader',
        options: {
          name: 'images/[name].[ext]',
        },
      },
    ]
  },
  {
    test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
    use: [
      {
        loader: 'url-loader',
        options: {
          name: 'fonts/[name].[ext]'
        },
      },
    ]
  },
  {
    test: /\.css$|\.scss$/,
    use: [
      isProdMode() ? MiniCssExtractPlugin.loader : 'style-loader',
      {
        loader: 'css-loader',
        options: {
          modules: {
            auto: /\.module\.\w+$/,
            getLocalIdent: defineGetLocalIdent()
          },
        },
      },
      {
        loader: 'sass-loader',
        options: {
          additionalData: '@import "variables";',
          sassOptions: {
            includePaths: [path.resolve(__dirname, 'src/styles')],
          },
        },

      },
      'postcss-loader'
    ]
  }
];

/** @type {import('webpack').ModuleOptions} */
const moduleWebpack = {
  rules
};

// eslint-disable-next-line no-restricted-syntax
for (const file of [...fs.readdirSync(srcDirPath)]) {
  if (file.indexOf('.vue') > -1) {
    resolve.extensions.push('.vue');
    rules.push({ test: /\.vue$/, loader: 'vue-loader' });
    insertBefore(VueLoaderPlugin, plugins, (pl) => pl instanceof CleanWebpackPlugin);
    break;
  }
}

/** @type {import('webpack').Configuration} */
const webpackGeneralConfig = {
  entry: fs.existsSync(path.resolve(srcDirPath, 'main.ts')) ? path.resolve(srcDirPath, 'main.ts') : path.resolve(srcDirPath, 'main.js'),
  output, resolve, plugins, stats, optimization,
  module: moduleWebpack
};

module.exports = webpackGeneralConfig;