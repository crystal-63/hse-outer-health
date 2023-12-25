const merge = require('webpack-merge')
const baseConfig = require('./webpack.base.conf')

module.exports = merge(baseConfig, {
    mode: 'development',
    target: 'web',
    devtool: 'eval-cheap-module-source-map',
    devServer: {
        port: 9090,
        hot: true,
        compress: true,
        open: true,
        proxy: {
            '/api/': {
                target: 'http://example.com:9090',
                changeOrigin: true
            }
        }
    }
})
