import {GET_SERVICES, HANDLE_ERROR, LOADING, GET_SERVICE} from './types';

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
export const getService = async (servicesType, dispatch) => {
  try {
    const services = await firestore()
      .collection('services')
      .where('isEnabled', '==', true)
      .where('slug', '==', servicesType)
      .get();
    const data = services.docs.map((doc) => {
      const item = doc.data();
      return {
        ...item,
        id: doc.id,
      };
    });

    dispatch({type: GET_SERVICE, payload: data});
  } catch (error) {
    console.log('error get service=>', error);
  }
};

export const updateOrder = async (data, typeData, id, dispatch) => {
  try {
    setLoading(true, dispatch);
    const userRef = firestore().collection('orders').doc(id);
    await userRef.set(
      {
        [typeData]: data,
      },
      {merge: true},
    );

    setLoading(false, dispatch);
  } catch (error) {
    console.log('error', error);
    setLoading(false, dispatch);
  }
};
/* export const updateOrder = async (data, id, dispatch) => {
  try {
    setLoading(true, dispatch);
    const userRef = firestore().collection('orders').doc(id);
    await userRef.set(data);

    setLoading(false, dispatch);
  } catch (error) {
    console.log('error', error);
    setLoading(false, dispatch);
  }
}; */

export const updateClient = async (data, typeData, uid, dispatch) => {
  try {
    setLoading(true, dispatch);
    const userRef = firestore().collection('users').doc(uid);
    await userRef.set(
      {
        [typeData]: data,
      },
      {merge: true},
    );

    setLoading(false, dispatch);
  } catch (error) {
    console.log('error', error);
    setLoading(false, dispatch);
  }
};
