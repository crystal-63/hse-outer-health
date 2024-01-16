const path = require("path");
const { VueLoaderPlugin } = require("vue-loader");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// const webpack = require("webpack");

const isProd = process.env.NODE_ENV === "production";

module.exports = {
  entry: path.resolve(__dirname, "../src/main.js"),
  output: {
    path: path.resolve(__dirname, "../dist"),
    publicPath: isProd ? "./" : "/",
    filename: "js/[name]_[chunkhash:8].js",
    chunkFilename: "js/[name]_[chunkhash:8].js",
  },
  module: {
    rules: [
      {
        test: /\.(eot|ttf|otf|woff2?)(\?\S*)?$/,
        type: "asset",
        parser: {
          dataUrlCondition: { maxSize: 1024 * 5 },
        },
        generator: {
          filename: "font/[name]-[hash:8][ext]",
        },
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        type: "asset",
        parser: {
          dataUrlCondition: { maxSize: 1024 * 5 },
        },
        generator: {
          filename: "image/[name]-[hash:8][ext]",
        },
      },
      {
        test: /\.s[ac]ss$/,
        // include: srcPath,
        use: [
          isProd ? MiniCssExtractPlugin.loader : "vue-style-loader",
          "css-loader",
          "postcss-loader",
          "sass-loader",
          // {
          //   loader: "sass-resources-loader",
          //   options: {
          //     resources: path.resolve(
          //       __dirname,
          //       "../src/assets/css/common.scss"
          //     ),
          //   },
          // },
        ],
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: isProd ? MiniCssExtractPlugin.loader : "vue-style-loader",
          },
          "css-loader",
          "postcss-loader",
        ],
      },
      {
        test: /\.js$/,
        use: ["babel-loader?cacheDirectory=true"],
        include: path.resolve(__dirname, "../src"),
        exclude: /node_modules/,
      },
      {
        test: /\.vue$/,
        include: path.resolve(__dirname, "../src"),
        loader: "vue-loader",
      },
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      title: "凤平台职业健康",
      // templateParameters: {
      //   BASE_URL: `/xfmWeb/`,
      // },
      templateParameters(compilation, assets, options) {
        return {
          BASE_URL: `/`,
          compilation: compilation,
          webpack: compilation.getStats().toJson(),
          webpackConfig: compilation.options,
          htmlWebpackPlugin: {
            files: assets,
            options: options,
          },
          process,
        };
      },
      assetsPublicPath: "./css",
      favicon: "public/xfm.ico",
      template: "public/index.html",
      ...(isProd
        ? {
            minify: {
              removeComments: true,
              collapseWhitespace: true,
            },
          }
        : {}),
    }),
  ],
  resolve: {
    extensions: [".js", ".vue", ".scss", ".css", ".json"],
    alias: {
      src: path.resolve(__dirname, "../src"),
      views: path.resolve(__dirname, "../src/views"),
      components: path.resolve(__dirname, "../src/components"),
      utils: path.resolve(__dirname, "../src/utils"),
      vue$: "vue/dist/vue.esm.js",
    },
  },
};
