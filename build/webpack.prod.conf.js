const isAnalyze = process.env.ANALYZE;
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const { merge } = require("webpack-merge");
const baseConfig = require("./webpack.base.conf");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

module.exports = merge(baseConfig, {
  mode: "production",
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      ignoreOrder: true,
      filename: `css/[name]_[chunkhash:8].css`,
      chunkFilename: `css/[name]_[chunkhash:8].css`,
      // filename: `${assets}/css/vendor.css?v=[contenthash:${hashLen}]`,
      // chunkFilename: `${assets}/css/[name].css?v=[contenthash:${hashLen}]`
    }),
    ...(isAnalyze ? [new BundleAnalyzerPlugin()] : []),
  ],
  cache: {
    type: "filesystem",
    buildDependencies: {
      config: [__filename],
    },
  },
  optimization: {
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin(),
      new TerserPlugin({
        extractComments: false,
        terserOptions: {
          format: {
            comments: false,
          },
          toplevel: true,
        },
      }),
      `...`,
    ],
    splitChunks: {
      cacheGroups: {
        vendors: {
          chunks: "all",
          name: "vendors",
          test: /[\\/]node_modules[\\/]/,
        },
      },
    },
  },
});
