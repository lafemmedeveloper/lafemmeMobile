import React, {useEffect} from 'react';
import DeviceInfo from 'react-native-device-info';
import Router from './src/config/Router';
import RouterExpert from './src/config/RouterExpert';
import Store from './src/flux';
import {appVersion, buildVersion} from './src/helpers/appVersion';
import NetInfo from '@react-native-community/netinfo';
import {Alert} from 'react-native';
import Config from 'react-native-config';
import * as Sentry from '@sentry/react-native';

if (Config && Config.SENTRY && __DEV__) {
  Sentry.init({
    dsn: Config.SENTRY,
    react: true,
    dist: buildVersion.toString(),
    release: appVersion.toString(),
    environment: __DEV__ ? 'development' : 'production',
    enableAutoSessionTracking: true,
    sessionTrackingIntervalMillis: 10000,
  });
}

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
        Alert.alert('Ups', 'Al parecer no tienes conexión a internet');
      }
    });
  }, []);

  return <Store>{isClient ? <Router /> : <RouterExpert />}</Store>;
};

export default App;
