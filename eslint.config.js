import stylistic from '@stylistic/eslint-plugin';

export default [
    {
        plugins: {
            '@stylistic': stylistic,
        },
        rules: {
            '@stylistic/semi': 'error',

            '@stylistic/jsx-indent': 'error',
        },
    },
];
