import path from 'node:path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import aliases from './aliases.js';

export default {
    mode: 'development',
    devtool: 'eval-source-map',
    entry: './demo/demo.js',
    output: {
        path: path.resolve('docs'),
        filename: 'scripts/bundle.js',
        assetModuleFilename: 'images/[name][ext]'
    },
    module: {
        rules: [
            {
                test: /\.ts/,
                use: 'ts-loader'
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader', 'postcss-loader']
            },
            {
                test: /\.(jp|pn)g$/,
                type: 'asset/resource'
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
        host: '0.0.0.0',
        compress: true,
        port: 9000
    }
};