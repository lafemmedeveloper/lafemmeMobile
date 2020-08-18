import {GET_SERVICES, HANDLE_ERROR, LOADING} from './types';

import firestore from '@react-native-firebase/firestore';
import _ from 'lodash';

export const handleError = (dispatch) => {
  dispatch({type: HANDLE_ERROR, payload: true});
  setLoading(false, dispatch);
};

export const setLoading = (loading, dispatch) => {
  dispatch({type: LOADING, payload: loading});
};
export const getServices = async (dispatch) => {
  console.log('se ejecuta services');
  try {
    const services = await firestore()
      .collection('services')
      .where('isEnabled', '==', true)
      .get();
    const data = services.docs.map((doc) => {
      const item = doc.data();
      return {
        ...item,
        id: doc.id,
      };
    });

    const sortedData = _.sortBy(data, 'order');
    dispatch({type: GET_SERVICES, payload: sortedData});
  } catch (error) {
    console.log('error get service=>', error);
  }
};
