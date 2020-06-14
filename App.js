import React, {Component} from 'react';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {store, persistor} from './App/Core';
import Router from './App/Config/Router';
import Config from 'react-native-config';
import RouterExpert from './App/Config/RouterExpert';
import DeviceInfo from 'react-native-device-info';
import Loading from './App/Components/Loading';
let bundleId = DeviceInfo.getBundleId();

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      bundleId: '',
      loading: true,
    };
    console.disableYellowBox = true;
    // persistor.purge();

    this.handleChange = this.handleChange.bind(this);
  }

  async componentDidMount() {
    this.unsubscribe = store.subscribe(this.handleChange);
    this.handleChange();

    console.log('config', {
      BUILD_TYPE: Config.BUILD_TYPE,
      FCM_KEY: Config.FCM_KEY,
    });
  }
  componentWillUnmount() {
    this.unsubscribe();
  }

  handleChange() {
    let loading = store.getState().ui.loading;

    this.setState({loading});
  }

  render() {
    const {loading} = this.state;

    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          {bundleId === 'com.femme.client' ||
          bundleId === 'com.femme.clientstaging' ? (
            <>
              <Router
                ref={nav => {
                  this.navigator = nav;
                }}
              />
              <Loading type={'client'} loading={loading} />
            </>
          ) : (
            <>
              <RouterExpert
                ref={nav => {
                  this.navigator = nav;
                }}
              />
              <Loading type={'expert'} loading={loading} />
            </>
          )}
        </PersistGate>
      </Provider>
    );
  }
}
