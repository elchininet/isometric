module.exports = {
    env: {
        browser: true,
        es6: true,
        node: true
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended'
    ],
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly'
    },
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module'
    },
    plugins: ['@typescript-eslint'],
    rules: {
        quotes: ['error', 'single', { 'avoidEscape': true, 'allowTemplateLiterals': true }],
        semi: ['error', 'always'],
        '@typescript-eslint/no-empty-interface': ['error', { allowSingleExtends: true }],
        'no-trailing-spaces': ['error']
    },
    overrides: [
        {
            files: ['webpack*.js', 'jest.config.js', 'aliases.js'],
            rules: {
                '@typescript-eslint/no-var-requires': 'off'
            }
        },
        {
            files: ['other.ts'],
            rules: {
                '@typescript-eslint/no-explicit-any': 'off'
            }
        }
    ]
};