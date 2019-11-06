import {GET_SERVICES} from './Types';

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
