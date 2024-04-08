const tseslint = require('typescript-eslint');
const js = require('@eslint/js');
const globals = require('globals');

module.exports = [
    {
        languageOptions: {
            globals: {
                Atomics: 'readonly',
                SharedArrayBuffer: 'readonly',
                ...globals.browser,
                ...globals.node,
                ...globals.es2020
            }
        }
    },
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        rules: {
            quotes: [
                'error',
                'single',
                {
                    avoidEscape: true,
                    allowTemplateLiterals: true
                }
            ],
            indent: ['error', 4, { SwitchCase: 1 }],
            semi: ['error', 'always'],
            'no-trailing-spaces': ['error'],
            '@typescript-eslint/no-duplicate-enum-values': 'off',
            '@typescript-eslint/no-var-requires': 'off',
            '@typescript-eslint/no-unsafe-declaration-merging': 'off'
        }
    },
    {
        files: ['src/@utils/other.ts'],
        rules: {
            '@typescript-eslint/no-explicit-any': 'off'
        }
    },
    {
        files: ['tests/*.ts'],
        rules: {
            '@typescript-eslint/ban-ts-comment': 'off'
        }
    }
];