import pkg from './package.json';
import ts from '@rollup/plugin-typescript';
import { dts } from 'rollup-plugin-dts';
import tsConfigPaths from 'rollup-plugin-tsconfig-paths';
import terser from '@rollup/plugin-terser';

const reference = '/// <reference types="./index.d.ts" />';
const nodeReference = '/// <reference types="./node.d.ts" />';
const banner = `
var dom = new jsdom.JSDOM('<!DOCTYPE html><html><body></body></html>');
var document = dom.window.document;
`;

const plugins = [
    ts(),
    terser({
        output: {
            comments: /reference/
        }
    })
];

const pluginsDts = [
    tsConfigPaths(),
    dts()
];

export default [
    {
        plugins,
        input: 'src/index.ts',
        output: [
            {
                file: 'dist/web/isometric.js',
                format: 'iife',
                name: 'isometric'
            },
            {
                file: pkg.exports['.'].require.default,
                format: 'cjs',
                banner: reference
            },
            {
                file: pkg.exports['.'].import.default,
                format: 'es',
                banner: reference
            }
        ]
    },
    {
        plugins,
        input: 'src/index.ts',
        output: [
            {
                file: pkg.exports['./node'].require.default,
                format: 'cjs',
                banner: `
                ${nodeReference}
                var jsdom = require('jsdom');
                ${banner}
                `
            },
            {
                file: pkg.exports['./node'].import.default,
                format: 'es',
                banner: `
                ${nodeReference}
                import jsdom from 'jsdom';
                ${banner}
                `
            }
        ]
    },
    {
        plugins: pluginsDts,
        input: 'src/index.ts',
        output: [
            {
                file: pkg.exports['.'].require.types,
                format: 'cjs'
            },
            {
                file: pkg.exports['.'].import.types,
                format: 'es'
            },
            {
                file: pkg.exports['./node'].require.types,
                format: 'cjs'
            },
            {
                file: pkg.exports['./node'].import.types,
                format: 'es'
            }
        ]
    },
];