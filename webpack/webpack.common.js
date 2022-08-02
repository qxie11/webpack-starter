const Path = require("path");
const fs = require("fs");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

function generateHtmlPlugins(templateDir) {
  const templateFiles = fs.readdirSync(Path.resolve(__dirname, templateDir));
  return templateFiles.map((item) => {
    const parts = item.split(".");
    const name = parts.slice(0, -1).join(".");
    const extension = parts.at(-1);
    return new HtmlWebpackPlugin({
      filename: `${name.replace(".", "/")}.html`,
      template: Path.resolve(__dirname, `${templateDir}/${name}.${extension}`),
      minify: true,
    });
  });
}

const htmlPlugins = generateHtmlPlugins("../src/html/views");

module.exports = {
  entry: {
    app: Path.resolve(__dirname, "../src/scripts/index.ts"),
  },
  output: {
    path: Path.join(__dirname, "../build"),
    filename: "js/[name].[hash].js",
  },
  optimization: {
    splitChunks: {
      chunks: "all",
      name: false,
    },
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [{ from: Path.resolve(__dirname, "../public"), to: "public" }],
    }),
  ].concat(htmlPlugins),
  resolve: {
    alias: {
      "~": Path.resolve(__dirname, "../src"),
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.ejs$/i,
        loader: "ejs-loader",
        options: {
          esModule: false,
          minimize: true,
        },
      },
      {
        test: /\.(woff2?|ttf|eot)(\?v=\w+)?$/,
        type: "asset/resource",
        generator: {
          filename: "fonts/[name][ext][query]",
        },
      },
      {
        test: /\.(ico|jpg|jpeg|png|gif|webp|svg)(\?.*)?$/,
        type: "asset/resource",
        generator: {
          filename: "images/[name][hash][ext][query]",
        },
      },
      {
        test: /\.(ico|svg)(\?.*)?$/,
        type: "asset/resource",
        generator: {
          filename: "images/icons/[name][hash][ext][query]",
        },
      },
    ],
  },
};
