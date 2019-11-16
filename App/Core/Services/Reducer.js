import {createReducer} from '../Config';
import {GET_SERVICES, GET_COVERAGE} from './Types';

const initialState = {
  services: [],
  coverageZones: [],
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

const descriptor = {
  [GET_SERVICES]: getServices,
  [GET_COVERAGE]: getCoverage,
};

export default createReducer(initialState, descriptor);
