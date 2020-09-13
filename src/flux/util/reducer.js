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
  GET_COORDINATE,
} from './types';
import _ from 'lodash';

export const INITIAL_STATE_UTIL = {
  loading: false,
  error: false,
  gallery: null,
  coverageZones: [],
  orders: [],
  history: [],
  deviceInfo: {
    bundleId: null,
    buildNumber: null,
    version: null,
    readableVersion: null,
  },
  expertOpenOrders: [],
  expertHistoryOrders: [],
  expertActiveOrders: [],
  ordersAll: [],
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
  let orders = _.filter(action.payload, (o) => o.status <= 5);
  let history = _.filter(action.payload, (o) => o.status > 5);

  orders = _.orderBy(orders, 'date', 'des');
  history = _.orderBy(history, 'date', 'asc');
  const ordersAll = _.orderBy(action.payload, 'date', 'asc');

  return {
    ...state,
    orders,
    history,
    ordersAll,
  };
};
const getDeviceInfo = (state, action) => {
  return {...state, deviceInfo: action.payload};
};
const getExpertActiveOrders = (state, action) => {
  return {
    ...state,
    expertActiveOrders: action.payload,
  };
};
const getExpertOpenOrders = (state, action) => {
  let expertOpenOrders = _.orderBy(action.payload, 'date', 'des');

  return {
    ...state,
    expertOpenOrders,
  };
};
const getCoordinate = (state, action) => {
  console.log('reducer data =>', action.payload);

  return {
    ...state,
    coordinate: action.payload,
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
  [GET_COORDINATE]: getCoordinate,
});
