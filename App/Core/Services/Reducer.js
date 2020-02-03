import {createReducer} from '../Config';
import {
  GET_SERVICES,
  GET_COVERAGE,
  GET_ORDERS,
  GET_EXPERT_OPEN_ORDERS,
  GET_EXPERT_ACTIVE_ORDERS,
  GET_EXPERT_HISTORY_ORDERS,
  GET_GALLERY,
} from './Types';
import _ from 'lodash';

const initialState = {
  services: [],
  coverageZones: [],
  orders: [],
  history: [],
  expertOpenOrders: [],
  expertActiveOrders: [],
  expertHistoryOrders: [],
  gallery: [],
};

const getServices = (state = initialState, {payload}) => {
  return {
    ...state,
    services: payload,
  };
};

const getGallery = (state = initialState, {payload}) => {
  return {
    ...state,
    gallery: payload,
  };
};

const getCoverage = (state = initialState, {payload}) => {
  return {
    ...state,
    coverageZones: payload,
  };
};

const getOrders = (state = initialState, {payload}) => {
  let orders = _.filter(payload, o => o.status <= 3);
  let history = _.filter(payload, o => o.status > 3);

  orders = _.orderBy(orders, 'date', 'des');
  history = _.orderBy(history, 'date', 'asc');

  // console.log('orders', orders, 'history', history);
  return {
    ...state,
    orders,
    history,
  };
};

const getExpertOpenOrders = (state = initialState, {payload}) => {
  let expertOpenOrders = _.orderBy(payload, 'date', 'des');

  return {
    ...state,
    expertOpenOrders,
  };
};

const getExpertActiveOrders = (state = initialState, {payload}) => {
  let expertActiveOrders = _.orderBy(payload, 'date', 'des');

  return {
    ...state,
    expertActiveOrders,
  };
};

const getExpertHistoryOrders = (state = initialState, {payload}) => {
  let expertHistoryOrders = _.orderBy(payload, 'date', 'des');

  return {
    ...state,
    expertHistoryOrders,
  };
};

const descriptor = {
  [GET_SERVICES]: getServices,
  [GET_COVERAGE]: getCoverage,
  [GET_ORDERS]: getOrders,
  [GET_GALLERY]: getGallery,
  [GET_EXPERT_OPEN_ORDERS]: getExpertOpenOrders,
  [GET_EXPERT_ACTIVE_ORDERS]: getExpertActiveOrders,
  [GET_EXPERT_HISTORY_ORDERS]: getExpertHistoryOrders,
};

export default createReducer(initialState, descriptor);
