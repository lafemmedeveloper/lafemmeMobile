import createReducer from '../createReducer';
import {GET_SERVICES, HANDLE_ERROR, LOADING, GET_SERVICE} from './types';

export const INITIAL_STATE_SERVICES = {
  loading: false,
  error: false,
  services: null,
  service: null,
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

const getServices = (state, action) => {
  return {
    ...state,
    services: action.payload,
  };
};

const getService = (state, action) => {
  return {
    ...state,
    service: action.payload,
  };
};

export default createReducer(INITIAL_STATE_SERVICES, {
  [LOADING]: setLoading,
  [HANDLE_ERROR]: setError,
  [GET_SERVICES]: getServices,
  [GET_SERVICE]: getService,
});
