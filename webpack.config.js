const path = require("path");

const mustache = {
  test: /\.html$/,
  loader: "mustache-loader"
};

const config = {
  entry: "./app/scripts/index.js",
  output: {
    filename: "index.js",
    publicPath: "/",
    path: path.resolve(__dirname, "public/scripts/")
  },
  module: {
    rules: [mustache]
  }
};

module.exports = config;
