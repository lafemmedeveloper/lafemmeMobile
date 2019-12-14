import {SET_LOADING, DEVICE_INFO} from './Types';

import DeviceInfo from 'react-native-device-info';

export const setLoading = state => dispatch => {
  dispatch({type: SET_LOADING, payload: state});
};

export const getDeviceInfo = () => async dispatch => {
  return new Promise(resolve => {
    let deviceInfo = {};

    try {
      deviceInfo.bundleId = DeviceInfo.getBundleId();
      deviceInfo.buildNumber = DeviceInfo.getBuildNumber();
      deviceInfo.version = DeviceInfo.getVersion();
      deviceInfo.readableVersion = DeviceInfo.getReadableVersion();

      let bundleSplit = deviceInfo.bundleId.split('.');
      let bundleType = bundleSplit[2];

      if (bundleType === 'client' || bundleType === 'clientstaging') {
        deviceInfo.appType = 'client';
      } else if (bundleType === 'expert' || bundleType === 'expertstaging') {
        deviceInfo.appType = 'expert';
      }

      // console.log('deviceInfo', deviceInfo);
      return resolve(dispatch({type: DEVICE_INFO, payload: deviceInfo}));
    } catch (e) {
      console.log('Trouble getting device info ', e);
    }
  });
};

// export const getDeviceInfo = async dispatch => {
//   let deviceJSON = {};

//   try {
//     deviceJSON.bundleId = await DeviceInfo.getBundleId();
//     deviceJSON.buildNumber = await DeviceInfo.getBuildNumber();
//     deviceJSON.version = await DeviceInfo.getVersion();
//     deviceJSON.readableVersion = await DeviceInfo.getReadableVersion();

//     console.log('deviceJSON', deviceJSON);
//     // dispatch({type: DEVICE_INFO, payload: deviceJSON});
//     return dispatch({type: DEVICE_INFO, payload: deviceJSON});
//   } catch (e) {
//     console.log('Trouble getting device info ', e);
//   }
// };
