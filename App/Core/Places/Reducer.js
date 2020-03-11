import {createReducer} from '../Config';
import {GET_PLACES} from './Types';

const initialState = {
  places: [],
};

const getPlaces = (state = initialState, {payload}) => {
  return {
    ...state,
    places: payload,
  };
};

const descriptor = {
  [GET_PLACES]: getPlaces,
};

export default createReducer(initialState, descriptor);
