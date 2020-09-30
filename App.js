import React from 'react';
import DeviceInfo from 'react-native-device-info';
import Router from './src/config/Router';
import RouterExpert from './src/config/RouterExpert';
import Store from './src/flux';
import NetInfo from '@react-native-community/netinfo';

let bundleId = DeviceInfo.getBundleId();
console.disableYellowBox = true;

const App = () => {
  const isClient =
    bundleId === 'com.femme.client' || bundleId === 'com.femme.clientstaging';

  NetInfo.fetch().then((state) => {
    console.log('Connection type ====>', state.type);
    console.log('Is connected? ====>', state.isConnected);
  });
  return <Store>{isClient ? <Router /> : <RouterExpert />}</Store>;
};

export default App;
