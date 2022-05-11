const PRODUCTION = 'production';
const DEVELOPMENT = 'development';

const low = (str) => str.trim().toLowerCase();

const isProdMode = () => {
  if (!process || !process.env || !process.env.NODE_ENV) return false;
  const { NODE_ENV } = process.env;
  return low(NODE_ENV) === PRODUCTION;
};

const isDevMode = () => !isProdMode();

const webpackFilename = (ext = 'js', hash = 8, naming = 'name') => {
  if (isProdMode()) {
    if (hash) return `[${naming}].[contenthash:${hash}].${ext}`;
    return `[${naming}].[contenthash].${ext}`;
  }
  return `[${naming}].${ext}`;
};

const resolveExtensions = (...extensions) => extensions.map(ext => `.${ext}`);

const removePlugin = (plugins, callback) => {
  const indexToRemove = plugins.findIndex(callback);
  if (indexToRemove > -1) {
    plugins.splice(indexToRemove, 1);
  }
};

const insertBefore = (theInserted, whereInsertArray, callback) => {
  const index = whereInsertArray.findIndex(callback);
  if (index > -1) {
    whereInsertArray.splice(index - 1, 0, theInserted);
  }
};

module.exports = {
  low, removePlugin, insertBefore,
  isDevMode, isProdMode, webpackFilename, resolveExtensions
};