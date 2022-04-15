import pkg from './package.json';
import ts from 'rollup-plugin-ts';
import { terser } from "rollup-plugin-terser";

const reference = '/// <reference types="./index.d.ts" />';
const esmReference = '/// <reference types="../index.d.ts" />';
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
                file: pkg.main,
                format: 'cjs',
                banner: reference
            },
            {
                file: pkg.module,
                format: 'es',
                banner: esmReference
            }
        ]
    },
    {
        plugins: getPlugins(),
        input: 'src/index.ts',
        output: [
            {
                file: pkg.exports['./node'].require,
                format: 'cjs',
                banner: `
                ${reference}
                var jsdom = require('jsdom');
                ${banner}
                `
            },
            {
                file: pkg.exports['./node'].import,
                format: 'es',
                banner: `
                ${esmReference}
                import jsdom from 'jsdom';
                ${banner}
                `
            }
        ]
    }
]; 