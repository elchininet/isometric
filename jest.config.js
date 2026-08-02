import { pathsToModuleNameMapper } from 'ts-jest';
import tsconfig from './tsconfig.json' with { type: 'json' };

export default {
    roots: ['<rootDir>/tests'],
    moduleNameMapper: pathsToModuleNameMapper(
        tsconfig.compilerOptions.paths,
        {
            prefix: '<rootDir>'
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