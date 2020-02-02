import {
  GET_SERVICES,
  GET_COVERAGE,
  GET_ORDERS,
  GET_EXPERT_OPEN_ORDERS,
  GET_EXPERT_ACTIVE_ORDERS,
  GET_EXPERT_HISTORY_ORDERS,
} from './Types';

import firestore from '@react-native-firebase/firestore';

// export const getServices = async dispatch => {

export const getServices = () => async dispatch => {
  const services = await firestore()
    .collection('services')
    .where('isEnabled', '==', true)
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

  // console.log('expertActivities', expertActivities);

  let ordersRef = firestore()
    .collection('orders')
    .where('status', '==', 0)
    .where('servicesType', 'array-contains-any', expertActivities);

  // getStore().currentUser.user.expertActivities.forEach(val => {
  //   console.log('=> val', val);
  //   // ordersRef = ordersRef.where('servicesType', 'array-contains', val);
  // });

  ordersRef.orderBy('createDate', 'desc');

  // console.log('ordersRef', ordersRef);

  let listOrders = [];

  ordersRef.onSnapshot(orders => {
    // console.log('=> orders', orders);
    listOrders = orders.docs.map(item => {
      return {
        id: item.id,
        ...item.data(),
      };
    });
    return dispatch({type: GET_EXPERT_OPEN_ORDERS, payload: listOrders});
  });
};

export const getExpertActiveOrders = () => (dispatch, getStore) => {
  // let expertActivities = getStore().currentUser.user.expertActivities;
  console.log('===> getExpertActiveOrders');
  let uid = getStore().currentUser.auth.uid;
  console.log(' getStore().currentUser.auth.uid', uid);

  let ordersRef = firestore()
    .collection('orders')
    .where('status', '>=', 1)
    .where('status', '<=', 4);

  ordersRef.where('experts', 'array-contains', uid);

  let listOrders = [];

  ordersRef.onSnapshot(orders => {
    console.log('=> orders', orders);

    listOrders = orders.docs.map(item => {
      return {
        id: item.id,
        ...item.data(),
      };
    });
    return dispatch({type: GET_EXPERT_ACTIVE_ORDERS, payload: listOrders});
  });
};

export const getExpertHistoryOrders = () => (dispatch, getStore) => {
  // let expertActivities = getStore().currentUser.user.expertActivities;
  console.log('===> getExpertHistoryOrders');
  let uid = getStore().currentUser.auth.uid;
  console.log(' getStore().currentUser.auth.uid', uid);

  let ordersRef = firestore()
    .collection('orders')
    .where('status', '>', 4);

  ordersRef.where('experts', 'array-contains', uid);

  let listOrders = [];

  ordersRef.onSnapshot(orders => {
    console.log('=> orders', orders);

    listOrders = orders.docs.map(item => {
      return {
        id: item.id,
        ...item.data(),
      };
    });
    return dispatch({type: GET_EXPERT_HISTORY_ORDERS, payload: listOrders});
  });
};

export const topicPush = (topic, notification, data) => async dispatch => {
  fetch('https://fcm.googleapis.com/fcm/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization:
        'key=AAAAKBT0Dt4:APA91bEFw5WX5PdNrg-I7C3lWdc1P7lOno7V-jLarijN6jp5VZIFpzOyV-9e5XC2qkGEW5YFQ7M2oUUCpYihRIXZMclZIQHemle-hOWHvRinCWH5HT2hS_nXImJa92cUWBcciL-_G3cE',
    },
    body: JSON.stringify({
      to: `/topics/${topic}`,
      notification,
      data,
    }),
  });
};

export const assignExpert = (
  orderId,
  orderIndex,
  expertData,
) => async dispatch => {
  let assignExpertURL = __DEV__
    ? 'http://localhost:5000/lafemme-5017a/us-central1/assignExpert'
    : 'http://test/lafemme-5017a/us-central1/assignExpert';

  fetch(assignExpertURL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      orderId,
      orderIndex,
      expertData,
    }),
  });
};
