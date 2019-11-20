import {createReducer} from '../Config';
import {GET_SERVICES, GET_COVERAGE, GET_ORDERS} from './Types';

const initialState = {
  services: [],
  coverageZones: [],
  orders: [],
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
  return {
    ...state,
    orders: payload,
  };
};

const descriptor = {
  [GET_SERVICES]: getServices,
  [GET_COVERAGE]: getCoverage,
  [GET_ORDERS]: getOrders,
};

export default createReducer(initialState, descriptor);
