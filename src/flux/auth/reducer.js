import createReducer from '../createReducer';
import {GET_USER, HANDLE_ERROR, LOADING, DEL_USER} from './types';

export const INITIAL_STATE_AUTH = {
  loading: false,
  error: false,
  user: null,
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

const getUser = (state, action) => {
  return {
    ...state,
    user: action.payload,
  };
};
const delUser = (state) => {
  return {
    ...state,
    user: null,
  };
};

export default createReducer(INITIAL_STATE_AUTH, {
  [LOADING]: setLoading,
  [HANDLE_ERROR]: setError,
  [GET_USER]: getUser,
  [DEL_USER]: delUser,
});
