const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const mustache = {
  test: /\.html$/,
  loader: "mustache-loader"
};

const config = {
  context: path.join(__dirname, "app"),
  entry: {
    index: "./scripts/index.js",
    "new-post": "./scripts/new-post.js"
  },
  output: {
    filename: "[name].js",
    publicPath: "/",
    path: path.resolve(__dirname, "public/scripts")
  },
  module: {
    rules: [mustache]
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: "**/*", to: "../", ignore: ["scripts/**/*", "template/**/*"] }
    ])
  ]
};

module.exports = config;
