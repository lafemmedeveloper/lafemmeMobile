import {
  GET_SERVICES,
  GET_COVERAGE,
  GET_ORDERS,
  GET_EXPERT_OPEN_ORDERS,
} from './Types';

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

export const getOrders = () => (dispatch, getStore) => {
  const ordersRef = firestore()
    .collection('orders')
    .where('client.uid', '==', getStore().currentUser.auth.uid);
  ordersRef.orderBy('createDate', 'desc');
  let listOrders = [];
  ordersRef.onSnapshot(orders => {
    listOrders = orders.docs.map(item => {
      return {
        id: item.id,
        ...item.data(),
      };
    });
    return dispatch({type: GET_ORDERS, payload: listOrders});
  });
};

export const getExpertOpenOrders = () => (dispatch, getStore) => {
  let expertActivities = getStore().currentUser.user.expertActivities;

  console.log('expertActivities', expertActivities);

  let ordersRef = firestore()
    .collection('orders')
    .where('status', '==', 0)
    .where('servicesType', 'array-contains-any', expertActivities);

  // getStore().currentUser.user.expertActivities.forEach(val => {
  //   console.log('=> val', val);
  //   // ordersRef = ordersRef.where('servicesType', 'array-contains', val);
  // });

  ordersRef.orderBy('createDate', 'desc');

  console.log('ordersRef', ordersRef);

  let listOrders = [];

  ordersRef.onSnapshot(orders => {
    console.log('=> orders', orders);
    listOrders = orders.docs.map(item => {
      return {
        id: item.id,
        ...item.data(),
      };
    });
    return dispatch({type: GET_EXPERT_OPEN_ORDERS, payload: listOrders});
  });
};
