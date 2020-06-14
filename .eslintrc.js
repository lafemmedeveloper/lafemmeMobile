module.exports = {
  root: true,
  extends: ['@react-native-community'],
  rules: {
    'react-native/no-inline-styles': 0,
    'no-shadow': 0,
    'no-unused-vars': 'error',
  },
  globals: {
    Intl: true,
    jest: true,

    // This can be removed after 0.63 update
    // https://github.com/facebook/react-native/commit/af8ea06bb44e84ce51d4ca4e76f0d66bf34323bd
    WebSocket: true,
  },
};
