const path = require('path');
const tsconfig = require('./tsconfig');

const { compilerOptions: { paths } } = tsconfig;
const aliasReg = (str) => str.replace(/^(.*)\/\*$/, '$1');
module.exports = Object.keys(paths).reduce(
    (obj, a) => (obj[aliasReg(a)] = path.resolve(__dirname, aliasReg(paths[a][0])), obj),
    {}
);