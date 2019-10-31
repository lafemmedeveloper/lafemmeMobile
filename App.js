import React, {Component} from 'react';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {store, persistor} from './App/Core';
import Router from './App/Config/Router';
import RouterExpert from './App/Config/RouterExpert';
import DeviceInfo from 'react-native-device-info';

let bundleId = DeviceInfo.getBundleId();
export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bundleId: '',
    };
    console.disableYellowBox = true;
    // persistor.purge();
  }

  async componentDidMount() {
    // DeviceInfo.getBundleId()
    //   .then(bundleId => {
    //     console.log('bundleId', bundleId);
    //     if (
    //       bundleId === 'com.lafemme.client' ||
    //       bundleId === 'com.lafemme.clientstaging'
    //     ) {
    //       this.state({bundleId: 'client'}, () => {
    //         console.log(this.state.bundleId);
    //       });
    //     }
    //     if (
    //       bundleId === 'com.lafemme.expert' ||
    //       bundleId === 'com.lafemme.expertstaging'
    //     ) {
    //       this.state({bundleId: 'expert'}, () => {
    //         console.log(this.state.bundleId);
    //       });
    //     }
    //   })
    //   .catch(err => console.error(err));
  }

  render() {
    if (
      bundleId === 'com.lafemme.client' ||
      bundleId === 'com.lafemme.clientstaging'
    ) {
      return (
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <Router
              ref={nav => {
                this.navigator = nav;
              }}
            />
          </PersistGate>
        </Provider>
      );
    }

    if (
      bundleId === 'com.lafemme.expert' ||
      bundleId === 'com.lafemme.expertstaging'
    ) {
      return (
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <RouterExpert
              ref={nav => {
                this.navigator = nav;
              }}
            />
          </PersistGate>
        </Provider>
      );
    }
  }
}
