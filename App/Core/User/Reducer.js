import {createReducer} from '../Config';
import {HANDLE_ERROR, SET_ACCOUNT, LOGIN, CREATE_USER} from './Types';

const initialState = {
  error: null,
  user: null,
};

const handleError = (state = initialState, {payload}) => {
  return {
    ...state,
    error: payload,
  };
};

const setAccount = (state = initialState, {payload}) => {
  return {
    ...state,
    error: payload,
  };
};
const descriptor = {
  [HANDLE_ERROR]: handleError,
  [SET_ACCOUNT]: setAccount,
};

export default createReducer(initialState, descriptor);
