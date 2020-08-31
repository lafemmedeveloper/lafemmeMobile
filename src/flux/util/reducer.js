import createReducer from '../createReducer';
import {
  GET_GALLERY,
  HANDLE_ERROR,
  LOADING,
  GET_COVERAGE,
  GET_ORDERS,
  DEVICE_INFO,
  GET_EXPERT_ACTIVE_ORDERS,
  GET_EXPERT_OPEN_ORDERS,
} from './types';
import _ from 'lodash';

export const INITIAL_STATE_UTIL = {
  loading: false,
  error: false,
  gallery: null,
  coverageZones: [],
  orders: [],
  deviceInfo: {
    bundleId: null,
    buildNumber: null,
    version: null,
    readableVersion: null,
  },
  expertOpenOrders: [],
};

const setLoading = (state, action) => {
  return {
    ...state,
    loading: action.payload,
  };
};

const setError = (state, action) => {
  return {
    ...state,
    error: action.payload,
  };
};

const getGallery = (state, action) => {
  return {
    ...state,
    gallery: action.payload,
  };
};
const getCoverage = (state, action) => {
  return {
    ...state,
    coverageZones: action.payload,
  };
};
const getOrder = (state, action) => {
  return {
    ...state,
    orders: action.payload,
  };
};
const getDeviceInfo = (state, action) => {
  return {...state, deviceInfo: action.payload};
};
const getExpertActiveOrders = (state, action) => {
  let expertActiveOrders = _.orderBy(action.payload, 'date', 'des');

  return {
    ...state,
    expertOpenOrders: expertActiveOrders,
  };
};
const getExpertOpenOrders = (state, action) => {
  let expertOpenOrders = _.orderBy(action.payload, 'date', 'des');

  return {
    ...state,
    expertOpenOrders,
  };
};

export default createReducer(INITIAL_STATE_UTIL, {
  [LOADING]: setLoading,
  [HANDLE_ERROR]: setError,
  [GET_GALLERY]: getGallery,
  [GET_COVERAGE]: getCoverage,
  [GET_ORDERS]: getOrder,
  [DEVICE_INFO]: getDeviceInfo,
  [GET_EXPERT_ACTIVE_ORDERS]: getExpertActiveOrders,
  [GET_EXPERT_OPEN_ORDERS]: getExpertOpenOrders,
});
