const { pathsToModuleNameMapper } = require('ts-jest');
const tsconfig = require('./tsconfig');

module.exports = {
    roots: ['<rootDir>/tests'],
    moduleNameMapper: pathsToModuleNameMapper(
        tsconfig.compilerOptions.paths,
        {
            prefix: '<rootDir>/src'
        }
    ),
    transform: {
        '^.+\\.ts$': 'ts-jest',
    },
    moduleFileExtensions: ['ts', 'js'],
    collectCoverageFrom: [
        'src/**/*.ts',
        '!src/index.ts',
        '!src/demo/**'
    ],
    testEnvironment: 'jsdom'
};