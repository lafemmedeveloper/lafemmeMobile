import {createReducer} from '../Config';
import {SET_AUTH, USER_ACCOUNT, LOG_OUT} from './Types';

const initialState = {
  auth: null,
  user: null,
};

const setAuth = (state = initialState, {payload}) => {
  return {
    ...state,
    auth: payload._user,
  };
};

const setAccount = (state = initialState, {payload}) => {
  return {
    ...state,
    user: payload,
  };
};
const logOut = (state = initialState, {payload}) => {
  console.log('logout', payload);
  return {
    auth: null,
    user: null,
  };
};

const descriptor = {
  [SET_AUTH]: setAuth,
  [USER_ACCOUNT]: setAccount,
  [LOG_OUT]: logOut,
};

export default createReducer(initialState, descriptor);
