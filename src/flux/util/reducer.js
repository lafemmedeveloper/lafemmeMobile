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
  GET_EXPERT_ORDER_HISTORY,
  GET_NAME_SERVICE,
} from './types';
import _ from 'lodash';

export const INITIAL_STATE_UTIL = {
  loading: false,
  error: false,
  gallery: [],
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
  nextOrder: [],
  nextOrderClient: [],
  activity: [],
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

  orders = _.orderBy(orders, 'date', 'desc');
  history = _.orderBy(history, 'date', 'asc');
  const ordersAll = _.orderBy(action.payload, 'date', 'desc');
  let nextOrder = orders.length > 0 ? [ordersAll[0]] : [];

  return {
    ...state,
    orders,
    history,
    ordersAll,
    nextOrderClient: nextOrder,
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
  let expertOpenOrders = _.orderBy(action.payload, 'date', 'des')
    .filter((o) => o.status >= 1)
    .filter((o) => o.status < 5);

  let expertHistoryOrders = _.orderBy(action.payload, 'date', 'des').filter(
    (o) => o.status >= 5,
  );

  return {
    ...state,
    expertOpenOrders,
    nextOrder: expertOpenOrders.length > 0 ? [expertOpenOrders[0]] : [],
    expertHistoryOrders,
    ordersAll: action.payload,
  };
};
const getCoordinate = (state, action) => {
  return {
    ...state,
    coordinate: action.payload,
  };
};
const getOrderHistory = (state, action) => {
  return {
    ...state,
    expertHistoryOrders: action.payload,
  };
};
const getNameService = (state, action) => {
  return {
    ...state,
    activity: action.payload,
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
  [GET_EXPERT_ORDER_HISTORY]: getOrderHistory,
  [GET_NAME_SERVICE]: getNameService,
});
