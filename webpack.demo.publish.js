const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const WebpackCconfig = require('./webpack.config')[1];

module.exports = {
    target: 'web',
    devtool: 'eval-source-map',
    entry: './demo/demo.js',
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader'
            },
            {
                test: /\.scss$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader']
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js'],
        alias: WebpackCconfig.resolve.alias
    },
    output: {
        path: path.resolve(__dirname, 'docs'),
        filename: 'scripts/bundle.js',
        libraryTarget: 'window'
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: 'Isometric demo',
            logo: 'images/logo.svg',
            favicon: './demo/favicon.png',
            template: './demo/demo.html'
        }),
        new MiniCssExtractPlugin({
            filename: 'styles/styles.css'
        }),
        new CopyWebpackPlugin({
            patterns: [{ from: './demo/images', to: 'images' }]
        })
    ]
};
