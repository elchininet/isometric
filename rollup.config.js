import pkg from './package.json';
import ts from 'rollup-plugin-ts';
import { terser } from 'rollup-plugin-terser';

const reference = '/// <reference types="./index.d.ts" />';
const nodeReference = '/// <reference types="./node.d.ts" />';
const banner = `
var dom = new jsdom.JSDOM('<!DOCTYPE html><html><body></body></html>');
var document = dom.window.document;
`;

const getPlugins = () => [
    ts(),
    terser({
        output: {
            comments: /reference/
        }
    })
];

export default [
    {
        plugins: getPlugins(),
        input: 'src/index.ts',
        output: [
            {
                file: 'web/isometric.js',
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
        plugins: getPlugins(),
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
    }
];