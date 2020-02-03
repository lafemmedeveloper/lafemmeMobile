import {createReducer} from '../Config';
import {SET_AUTH, USER_ACCOUNT, LOG_OUT, SET_TEMP_DATA} from './Types';

const initialState = {
  auth: null,
  user: null,
  tempDataRegister: null,
};

const setAuth = (state = initialState, {payload}) => {
  return {
    ...state,
    auth: payload._user,
  };
};

const setTempRegister = (state = initialState, {payload}) => {
  return {
    ...state,
    tempDataRegister: payload,
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
  [SET_TEMP_DATA]: setTempRegister,
  [USER_ACCOUNT]: setAccount,
  [LOG_OUT]: logOut,
};

export default createReducer(initialState, descriptor);
