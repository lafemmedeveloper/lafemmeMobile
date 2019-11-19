import {GET_SERVICES, GET_COVERAGE} from './Types';

import firestore from '@react-native-firebase/firestore';

// export const getServices = async dispatch => {

export const getServices = () => async dispatch => {
  const services = await firestore()
    .collection('services')
    .get();
  const data = await services.docs.map(doc => {
    const item = doc.data();
    // console.log('getServices', item);
    return {
      ...item,
      id: doc.id,
    };
  });

  return dispatch({type: GET_SERVICES, payload: data});
};

export const getCoverage = city => async dispatch => {
  const coverageZones = await firestore()
    .collection('coverageZones')
    .get()
    .then('isActive', '===', true)
    .then('city', '===', city);

  const data = await coverageZones.docs.map(doc => {
    const item = doc.data();
    // console.log('getServices', item);
    return {
      ...item,
      id: doc.id,
    };
  });

  return dispatch({type: GET_COVERAGE, payload: data});
};
