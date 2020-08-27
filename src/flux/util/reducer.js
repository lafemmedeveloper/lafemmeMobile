import createReducer from '../createReducer';
import {GET_GALLERY, HANDLE_ERROR, LOADING, GET_COVERAGE} from './types';

export const INITIAL_STATE_UTIL = {
  loading: false,
  error: false,
  gallery: null,
  coverageZones: [],
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

const getGallery = (state, action) => {
  return {
    ...state,
    gallery: action.payload,
  };
};
const getCoverage = (state, action) => {
  return {
    ...state,
    coverageZones: action.payload,
  };
};

export default createReducer(INITIAL_STATE_UTIL, {
  [LOADING]: setLoading,
  [HANDLE_ERROR]: setError,
  [GET_GALLERY]: getGallery,
  [GET_COVERAGE]: getCoverage,
});
