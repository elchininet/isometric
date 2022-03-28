import pkg from './package.json';
import ts from 'rollup-plugin-ts';
import { terser } from "rollup-plugin-terser";

const banner = `
var dom = new jsdom.JSDOM('<!DOCTYPE html><html><body></body></html>');
var document = dom.window.document;
`;

const getPlugins = () => [
    ts(),
    terser({
        output: {
            comments: false
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
            { file: pkg.main, format: 'cjs' },
            { file: pkg.module, format: 'es' }
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
                var jsdom = require('jsdom');
                ${banner}
                `
            },
            {
                file: pkg.exports['./node'].import,
                format: 'es',
                banner: `
                import jsdom from 'jsdom';
                ${banner}
                `
            }
        ]
    }
]; 