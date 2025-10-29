module.exports = {
    env: {
        browser: true,
        es2021: true,
        'react-native/react-native': true,
    },
    extends: ['airbnb', 'airbnb/hooks', 'airbnb-typescript'],
    ignorePatterns: ['*.js', 'node_modules/', 'babel.config.js', 'metro.config.js'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 12,
        sourceType: 'module',
        project: './tsconfig.json',
    },
    plugins: ['react', 'react-native', '@typescript-eslint'],
    rules: {
        // 你可以在这里添加自定义规则覆盖
        'react/react-in-jsx-scope': 'off',
        'react/prop-types': 'off',
        'react/require-default-props': 'off',
        'react/style-prop-object': 'off',
        '@typescript-eslint/no-use-before-define': ['error', { functions: false, classes: false, variables: false }],
        'no-use-before-define': 'off',
        'import/prefer-default-export': 'off',
        'no-console': 'off',
        'react/jsx-one-expression-per-line': 'off',
        'object-curly-newline': 'off',
        'operator-linebreak': 'off',
        'no-restricted-globals': ['error', 'event', 'fdescribe'],
        'no-restricted-syntax': 'off',
        'no-await-in-loop': 'off',
        'react/jsx-wrap-multilines': 'off',
    },
};
