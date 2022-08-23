const rootlint = require('../../.eslintrc.js');

module.exports = {
  ...rootlint,
  rules: {
    ...rootlint.rules,
    'no-restricted-imports': [
      'error',
      {
        name: 'tailchat-shared',
        message: 'Only allow use `@capital/*`',
      },
      {
        name: 'translate',
        message: 'Maybe you should use `./translate`',
      },
    ],
  },
};
