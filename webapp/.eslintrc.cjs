module.exports = {
  env: { browser: true, es2020: true },
  extends: [
    'airbnb',
    'airbnb-typescript',
    'airbnb/hooks',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['react-refresh', '@typescript-eslint', 'simple-import-sort', 'prettier'],
  ignorePatterns: ['.eslintrc.cjs', 'public/*', 'vite.config.ts', 'dist/*'],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/require-default-props': 'off',
    'import/prefer-default-export': 'off',
    'react-refresh/only-export-components': 'warn',
    'simple-import-sort/imports': 'warn',
    'simple-import-sort/exports': 'warn',
    '@typescript-eslint/no-explicit-any': 'off',
    'react/function-component-definition': [
      'error',
      {
        namedComponents: ['function-declaration', 'arrow-function'],
        unnamedComponents: 'arrow-function',
      },
    ],
  },
}
