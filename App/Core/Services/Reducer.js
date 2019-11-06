import {createReducer} from '../Config';
import {GET_SERVICES} from './Types';

const initialState = {
  services: [],
};

const getServices = (state = initialState, {payload}) => {
  return {
    ...state,
    services: payload,
  };
};

const descriptor = {
  [GET_SERVICES]: getServices,
};

export default createReducer(initialState, descriptor);
