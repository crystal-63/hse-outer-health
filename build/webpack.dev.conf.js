const merge = require("webpack-merge");
const baseConfig = require("./webpack.base.conf");

module.exports = merge(baseConfig, {
  mode: "development",
  target: "web",
  devtool: "eval-cheap-module-source-map",
  devServer: {
    port: 8060,
    hot: true,
    compress: true,
    open: true,
    proxy: {
      "/api/": {
        target: "121.196.224.33:8060",
        changeOrigin: true,
      },
    },
  },
});
