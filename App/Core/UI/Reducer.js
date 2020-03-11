import {createReducer} from '../Config';
import {SET_LOADING, DEVICE_INFO} from './Types';

const initialState = {
  loading: false,
  deviceInfo: {
    bundleId: null,
    buildNumber: null,
    version: null,
    readableVersion: null,
  },
};

const setLoading = (state = initialState, {payload}) => {
  return {
    ...state,
    loading: payload,
  };
};
const getDeviceInfo = (state = initialState, {payload}) => {
  return {...state, deviceInfo: payload};
};

const descriptor = {
  [SET_LOADING]: setLoading,
  [DEVICE_INFO]: getDeviceInfo,
};

export default createReducer(initialState, descriptor);
