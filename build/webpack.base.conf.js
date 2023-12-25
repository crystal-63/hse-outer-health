const path = require('path')
const { VueLoaderPlugin } = require('vue-loader')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const isProd = process.env.NODE_ENV === 'production'

module.exports = {
    entry: path.resolve(__dirname, '../src/main.js'),
    output: {
        path: path.resolve(__dirname, '../dist'),
        publicPath: isProd ? './' : '/',
        filename: 'js/[name]_[chunkhash:8].js',
        chunkFilename: 'js/[name]_[chunkhash:8].js'
    },
    module: {
        rules: [
            {
                test: /\.(eot|ttf|otf|woff2?)(\?\S*)?$/,
                type: 'asset',
                parser: {
                    dataUrlCondition: { maxSize: 1024 * 5 }
                },
                generator: {
                    filename: 'font/[name]_[hash:8][ext]'
                }
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                type: 'asset',
                parser: {
                    dataUrlCondition: { maxSize: 1024 * 5 }
                },
                generator: {
                    filename: 'images/[name]_[hash:8][ext]'
                }
            },
            {
                test: /\.s[ac]ss$/,
                include: srcPath,
                use: [
                    isProd ? MiniCssExtractPlugin.loader : 'vue-style-loader',
                    'css-loader',
                    'postcss-loader',
                    'sass-loader',
                    {
                        loader: 'sass-resources-loader',
                        options: {
                            resources: path.resolve(__dirname, '../src/style/variable.scss')
                        }
                    }
                ]
            },
            {
                test: /\.css$/,
                use: [
                    isProd ? MiniCssExtractPlugin.loader : 'vue-style-loader',
                    'css-loader',
                    'postcss-loader'
                ]
            }
            {
                test: /\.js$/,
                use: ['babel-loader?cacheDirectory=true'],
                include: path.resolve(__dirname, '../src'),
                exclude: /node_modules/
            },
            {
                test: /\.vue$/,
                include: path.resolve(__dirname, '../src'),
                loader: 'vue-loader'
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            title: 'xxx系统',
            template: 'index.html',
            ...(isProd ? {
                minify: {
                    removeComments: true,
                    collapseWhitespace: true
                }
            }, {})
        })
    ],
    resolve: {
        extensions: ['.js', '.vue', '.scss', '.css', '.json'],
        alias: {
            'src': path.resolve(__dirname, '../src'),
            'views': path.resolve(__dirname, '../src/views'),
            'components': path.resolve(__dirname, '../src/components'),
            'directives': path.resolve(__dirname, '../src/directives'),
            'filters': path.resolve(__dirname, '../src/filters'),
            'images': path.resolve(__dirname, '../src/images'),
            'modules': path.resolve(__dirname, '../src/modules'),
            'style': path.resolve(__dirname, '../src/style'),
            'utils': path.resolve(__dirname, '../src/utils'),
            'vue$': 'vue/dist/vue.esm.js'
        }
    }
}
