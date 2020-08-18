module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    '@babel/plugin-proposal-export-default-from',
    '@babel/plugin-proposal-export-namespace-from',
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          App: './src',
          Components: './src/components',
          Screens: './src/screens',
          Flux: './src/flux',
          Themes: './src/themes',
          Utilities: './src/utilities',
          Helpers: './src/helpers',
          'jest-config': './jest-config',
          test: './__tests__',
        },
      },
    ],
  ],
};
