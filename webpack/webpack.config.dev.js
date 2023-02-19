const Path = require("path");
const { merge } = require("webpack-merge");
const ESLintPlugin = require("eslint-webpack-plugin");
const StylelintPlugin = require("stylelint-webpack-plugin");

const common = require("./webpack.common.js");

const ESLINT_USE = false;
const STYLE_LINT_USE = true;

module.exports = merge(common, {
  target: "web",
  mode: "development",
  devtool: "source-map",
  output: {
    chunkFilename: "js/[name].chunk.js",
  },
  devServer: {
    client: {
      logging: "error",
    },
    hot: true,
  },
  plugins: [
    ESLINT_USE &&
      new ESLintPlugin({
        extensions: "js",
        emitError: true,
        files: Path.resolve(__dirname, "../src"),
      }),
    STYLE_LINT_USE &&
      new StylelintPlugin({
        files: Path.join("src", "**/*.s?(a|c)ss"),
        emitError: true,
      }),
  ].filter(Boolean),
  module: {
    rules: [
      {
        test: /\.js$/,
        include: Path.resolve(__dirname, "../src"),
        loader: "babel-loader",
      },
      {
        test: /\.s?css$/i,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              sourceMap: true,
            },
          },
          "postcss-loader",
          "sass-loader",
        ],
      },
    ],
  },
});
