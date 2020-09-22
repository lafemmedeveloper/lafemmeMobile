import React from 'react';

import DeviceInfo from 'react-native-device-info';
import Config from 'react-native-config';
import Router from './src/config/Router';
import RouterExpert from './src/config/RouterExpert';
import Store from './src/flux';

let bundleId = DeviceInfo.getBundleId();
console.disableYellowBox = true;
const App = () => {
  console.log('==> Config:', Config);
  console.log('==> bundleId:', bundleId);

  const isClient =
    bundleId === 'com.femme.client' || bundleId === 'com.femme.clientstaging';
  return (
    <>
      <Store>{isClient ? <Router /> : <RouterExpert />}</Store>
    </>
  );
};

export default App;
