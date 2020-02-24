const { compilerOptions: { baseUrl, paths } } = require('./tsconfig');
const reg = /(.*)\/\*/;
const aliases = Object.keys(paths).reduce(
    (obj, a) => {
        if (reg.test(a)) {
            obj[`^${a.replace(reg, '$1')}/(.*)$`] = `<rootDir>/src/${paths[a][0].replace(reg, '$1')}/$1`;
        } else {
            obj[`^${a}$`] = `<rootDir>/src/${paths[a][0]}`;
        }
        return obj;
    },
    {}
);

module.exports = {
    roots: ['<rootDir>/tests'],
    moduleNameMapper: aliases,
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    testRegex: '.*\\.ts?$',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
};