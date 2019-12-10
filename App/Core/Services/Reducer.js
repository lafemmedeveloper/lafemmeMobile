import {createReducer} from '../Config';
import {
  GET_SERVICES,
  GET_COVERAGE,
  GET_ORDERS,
  GET_EXPERT_OPEN_ORDERS,
} from './Types';
import _ from 'lodash';

const initialState = {
  services: [],
  coverageZones: [],
  orders: [],
  history: [],
  expertOpenOrders: [],
};

const getServices = (state = initialState, {payload}) => {
  return {
    ...state,
    services: payload,
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

  console.log('orders', orders, 'history', history);
  return {
    ...state,
    orders,
    history,
  };
};

const getExpertOpenOrders = (state = initialState, {payload}) => {
  let expertOpenOrders = _.filter(payload, o => o.status <= 3);

  expertOpenOrders = _.orderBy(expertOpenOrders, 'date', 'des');

  console.log('orders', expertOpenOrders);
  return {
    ...state,
    expertOpenOrders,
  };
};

const descriptor = {
  [GET_SERVICES]: getServices,
  [GET_COVERAGE]: getCoverage,
  [GET_ORDERS]: getOrders,
  [GET_EXPERT_OPEN_ORDERS]: getExpertOpenOrders,
};

export default createReducer(initialState, descriptor);
