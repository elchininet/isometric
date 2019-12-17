/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackCconfig = require('./webpack.config')[1];
/* eslint-enable @typescript-eslint/no-var-requires */
WebpackCconfig.mode = 'development';
WebpackCconfig.entry = './src/@demo/demo.js';
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
        title: 'IsometricJS demo',
        logo: './src/@demo/images/logo.svg',
        favicon: './src/@demo/favicon.png',
        template: 'src/@demo/demo.html'
    })
];
WebpackCconfig.devServer = {
    compress: true,
    port: 9000
};

module.exports = WebpackCconfig;