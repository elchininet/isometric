const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackCconfig = require('./webpack.config')[1];

WebpackCconfig.mode = 'development';
WebpackCconfig.entry = './demo/demo.js';
WebpackCconfig.output.path = path.resolve(__dirname, 'docs');
WebpackCconfig.resolve.extensions.push('.js');
WebpackCconfig.module.rules.push(
    {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
    },
    {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
    }
);
WebpackCconfig.plugins = [
    new HtmlWebpackPlugin({
        title: 'Isometric demo',
        logo: './demo/images/logo.svg',
        favicon: './demo/favicon.png',
        template: './demo/demo.html'
    })
];
WebpackCconfig.devServer = {
    compress: true,
    port: 9000
};

module.exports = WebpackCconfig;