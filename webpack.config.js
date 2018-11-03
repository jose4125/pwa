const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const mustache = {
  test: /\.html$/,
  loader: "mustache-loader"
};

const config = {
  context: path.join(__dirname, "app"),
  entry: "./scripts/index.js",
  output: {
    filename: "index.js",
    publicPath: "/",
    path: path.resolve(__dirname, "public/scripts")
  },
  module: {
    rules: [mustache]
  },
  plugins: [new CopyWebpackPlugin([{ from: "sw-*.js", to: "../" }])]
};

module.exports = config;
