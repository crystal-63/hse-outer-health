const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
  transpileDependencies: true,
  baseUrl: "./",
  devServer: {
    port: 8060,
  },
  // 输出目录
  outputDir: "dist",
  // 静态文件目录
  assetsDir: "assets",
  // html 输出路径
  indexPath: "index.html",
  filenameHashing: true,
  pages: {
    index: {
      // 入口文件
      entry: "src/main.js",
      // 模板文件
      template: "public/index.html",
      filename: "index.html",
      title: "凤平台",
      chunks: ["chunk-vendors", "chunk-common", "index"],
    },
  },

  lintOnSave: false, // 暂时关闭eslint

  runtimeCompiler: false,
  // 生产环境构建生成 source map
  productionSourceMap: true,
});
