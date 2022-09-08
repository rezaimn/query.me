module.exports = {
  extends: ['airbnb-base', 'prettier'],
  plugins: ['import'],
  parser: '@babel/eslint-parser',
  rules: {
    'no-sparse-arrays': 'off',
    'no-shadow': 'off',
    'no-use-before-define': 'off',
    'class-methods-use-this': 'off',
    'import/no-dynamic-require': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/prefer-default-export': 'off',
    'lines-between-class-members': 'off',
    'prefer-destructuring': 'off',
    'no-return-assign': 'off',
    'prefer-object-spread': 'off',
    'max-classes-per-file': 'off',
    'import/order': 'off',
    'no-else-return': 'warn',
    'no-restricted-globals': 'warn',
    'prefer-promise-reject-errors': 'off',
    'no-useless-catch': 'warn',
    camelcase: 'warn',
    'no-plusplus': 'off',
    'arrow-body-style': 'off',
  },
  overrides: [
    {
      files: ['*.test.js'],
      env: {
        jest: true,
      },
      rules: {
        'no-param-reassign': 'off',
      },
    },
  ],
  globals: {
    $: true,
  },
};
