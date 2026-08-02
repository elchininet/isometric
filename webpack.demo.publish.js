import path from 'node:path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import aliases from './aliases.js';

export default {
    target: 'web',
    devtool: 'eval-source-map',
    entry: './demo/demo.js',
    output: {
        path: path.resolve('docs'),
        filename: 'scripts/bundle.js',
        libraryTarget: 'window',
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
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader']
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
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: []
        }),
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
