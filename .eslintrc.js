module.exports = {
    env: {
        browser: true,
        es2021: true,
        'react-native/react-native': true,
    },
    extends: ['airbnb', 'airbnb/hooks'],
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 12,
        sourceType: 'module',
    },
    plugins: ['react', 'react-native'],
    rules: {
        // 你可以在这里添加自定义规则覆盖
        'react/react-in-jsx-scope': 'off', // React 17+ 不需要在文件中导入 React
        'react/prop-types': 'warn', // 将 prop-types 警告而不是错误
    },
};
