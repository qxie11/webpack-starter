const { merge } = require("webpack-merge");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const CSSMinimizerWebpackPlugin = require("css-minimizer-webpack-plugin");

const common = require("./webpack.common.js");

module.exports = merge(common, {
  mode: "production",
  devtool: "source-map",
  stats: "errors-only",
  bail: true,
  output: {
    filename: "js/[name].[chunkhash:8].js",
    chunkFilename: "js/[name].[chunkhash:8].chunk.js",
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        test: /\.js(\?.*)?$/i,
        minify: TerserPlugin.uglifyJsMinify,
        extractComments: true,
        terserOptions: {
          compress: true,
        },
      }),
      new CSSMinimizerWebpackPlugin({
        minimizerOptions: {
          preset: [
            "default",
            {
              discardComments: { removeAll: true },
            },
          ],
        },
        minify: CSSMinimizerWebpackPlugin.cssnanoMinify,
      }),
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/[name].[chunkhash:8].css",
      chunkFilename: "css/[name].[chunkhash:8].chunk.js",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
      {
        test: /\.s?css/i,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.(gif|svg)$/i,
        loader: ImageMinimizerPlugin.loader,
        enforce: "pre",
        options: {
          minimizer: {
            implementation: ImageMinimizerPlugin.imageminMinify,
            options: {
              plugins: ["imagemin-gifsicle", "imagemin-svgo"],
            },
          },
        },
      },
    ],
  },
});
