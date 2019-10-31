import {createReducer} from '../Config';
import {GET_CITIES} from './Types';

const initialState = {
  cities: [],
};

const getCities = (state = initialState, {payload}) => {
  return {
    ...state,
    cities: payload,
  };
};

const descriptor = {
  [GET_CITIES]: getCities,
};

export default createReducer(initialState, descriptor);
