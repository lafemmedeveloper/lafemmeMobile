import React, {useEffect} from 'react';
import DeviceInfo from 'react-native-device-info';
import Router from './src/config/Router';
import RouterExpert from './src/config/RouterExpert';
import Store from './src/flux';
import NetInfo from '@react-native-community/netinfo';
import {Alert} from 'react-native';

let bundleId = DeviceInfo.getBundleId();
console.disableYellowBox = true;

const App = () => {
  const isClient =
    bundleId === 'com.femme.client' || bundleId === 'com.femme.clientstaging';

  useEffect(() => {
    NetInfo.fetch().then((state) => {
      console.log('Connection type ====>', state.type);
      console.log('Is connected? ====>', state.isConnected);
      if (!state.isConnected) {
        Alert.alert('Ups', 'Al parecer no tienes conexion a internet');
      }
    });
  }, []);

  return <Store>{isClient ? <Router /> : <RouterExpert />}</Store>;
};

export default App;
