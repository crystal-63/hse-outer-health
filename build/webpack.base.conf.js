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
          filename: "css/font/[name]-[hash:8][ext]",
        },
        // options: {
        //   limit: 10000,
        //   // 以下是我需要解决路径问题的代码， 只需要加入publicPath: '../../
        //   publicPath: "../",
        //   name: "font/[name]-[hash:8].[ext]",
        // },
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        type: "asset",
        parser: {
          dataUrlCondition: { maxSize: 1024 * 5 },
        },
        generator: {
          filename: "images/[name]-[hash:8].[ext]",
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
          {
            loader: "sass-resources-loader",
            options: {
              resources: path.resolve(__dirname, "../src/style/variable.scss"),
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          isProd ? MiniCssExtractPlugin.loader : "vue-style-loader",
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
    // new webpack.DefinePlugin({
    //   // webpack自带该插件，无需单独安装
    //   "process.env": {
    //     NODE_ENV: process.env.NODE_ENV, // 将属性转化为全局变量，让代码中可以正常访问
    //   },
    // }),
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      title: "凤平台职业健康",
      templateParameters: {
        BASE_URL: `/`,
      },
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
      directives: path.resolve(__dirname, "../src/directives"),
      filters: path.resolve(__dirname, "../src/filters"),
      images: path.resolve(__dirname, "../src/images"),
      modules: path.resolve(__dirname, "../src/modules"),
      style: path.resolve(__dirname, "../src/style"),
      utils: path.resolve(__dirname, "../src/utils"),
      vue$: "vue/dist/vue.esm.js",
    },
  },
};
