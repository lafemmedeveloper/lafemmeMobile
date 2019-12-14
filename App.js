import React, {Component} from 'react';
import {Provider} from 'react-redux';
import {View} from 'react-native';
import {PersistGate} from 'redux-persist/integration/react';
import {store, persistor} from './App/Core';
import Router from './App/Config/Router';
import RouterExpert from './App/Config/RouterExpert';
import DeviceInfo from 'react-native-device-info';
import {ApplicationStyles} from './App/Themes';
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
    let unsubscribe = store.subscribe(this.handleChange);
    this.handleChange();
  }

  handleChange() {
    let loading = store.getState().ui.loading;

    this.setState({loading});
  }

  render() {
    const {loading} = this.state;

    // console.log('bundleId', bundleId, bundleId === 'com.lafemme.expertstaging');
    // if (
    //   bundleId === 'com.lafemme.client' ||
    //   bundleId === 'com.lafemme.clientstaging'
    // ) {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          {bundleId === 'com.lafemme.client' ||
          bundleId === 'com.lafemme.clientstaging' ? (
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
          <Loading type={'client'} loading={loading} />
        </PersistGate>
      </Provider>
    );
    // }

    // if (
    //   bundleId === 'com.lafemme.expert' ||
    //   bundleId === 'com.lafemme.expertstaging'
    // ) {
    //   return (
    //     <Provider store={store}>
    //       <PersistGate loading={null} persistor={persistor}>
    //         <RouterExpert
    //           ref={nav => {
    //             this.navigator = nav;
    //           }}
    //         />
    //         <Loading type={'expert'} loading={loading} />
    //       </PersistGate>
    //     </Provider>
    //   );
    // }
  }
}
