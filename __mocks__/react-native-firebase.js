const reactNativeFirebase = jest.mock(
  '@react-native-firebase/app',
  () => 'RNFirebase',
);

module.exports = reactNativeFirebase;
