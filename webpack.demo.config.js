const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const aliases = require('./aliases');

module.exports = {
    mode: 'development',
    devtool: 'eval-source-map',
    entry: './demo/demo.js',
    output: {
        path: path.resolve(__dirname, 'docs'),
        filename: 'scripts/bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.ts/,
                use: 'ts-loader'
            },
            {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js'],
        alias: aliases
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Isometric demo',
            logo: 'images/logo.svg',
            favicon: './demo/favicon.png',
            template: './demo/demo.html'
        }),
        new CopyWebpackPlugin({
            patterns: [{ from: 'demo/images', to: 'images' }]            
        })
    ],
    devServer: {
        compress: true,
        port: 9000
    }
};