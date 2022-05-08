module.exports = {
  presets: [
    "@babel/preset-react",
    "@babel/preset-typescript",
    "@babel/preset-env",
  ],
  plugins: [
    "@babel/plugin-proposal-class-properties", // transforms static class properties as well as properties declared with the property initializer syntax
    "jsx-classnames-advanced",
  ],
};
