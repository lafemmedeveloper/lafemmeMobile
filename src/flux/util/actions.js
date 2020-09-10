import {
  GET_GALLERY,
  HANDLE_ERROR,
  LOADING,
  GET_COVERAGE,
  GET_ORDERS,
  DEVICE_INFO,
  GET_EXPERT_ACTIVE_ORDERS,
  GET_EXPERT_OPEN_ORDERS,
} from './types';

import firestore from '@react-native-firebase/firestore';
import DeviceInfo from 'react-native-device-info';
import auth from '@react-native-firebase/auth';

export const handleError = (dispatch) => {
  dispatch({type: HANDLE_ERROR, payload: true});
  setLoading(false, dispatch);
};

export const setLoading = (loading, dispatch) => {
  dispatch({type: LOADING, payload: loading});
};
export const getGallery = async (dispatch) => {
  try {
    const services = await firestore().collection('gallery').get();
    const data = services.docs.map((doc) => {
      const item = doc.data();
      return {
        ...item,
        id: doc.id,
      };
    });

    dispatch({type: GET_GALLERY, payload: data});
  } catch (error) {
    console.log('error get service=>', error);
  }
};
export const topicPush = (topic, notification, data) => {
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
export const getCoverage = async (city, dispatch) => {
  try {
    setLoading(true, dispatch);
    const cityEnable = city ? city : 'Medellin';
    const coverageZones = await firestore()
      .collection('coverageZones')
      .get()
      .then('isActive', '===', true)
      .then('city', '===', cityEnable);

    const data = coverageZones.docs.map((doc) => {
      const item = doc.data();
      return {
        ...item,
        id: doc.id,
      };
    });
    dispatch({type: GET_COVERAGE, payload: data});
    setLoading(false, dispatch);
  } catch (error) {
    setLoading(false, dispatch);
    console.log('error getCoverage =>', error);
  }
};
export const getOrders = (dispatch) => {
  const uid = auth().currentUser.uid;
  try {
    console.log('<=== Active getOrder functions ===>');
    setLoading(true, dispatch);
    const ordersRef = firestore()
      .collection('orders')
      .where('client.uid', '==', uid);
    ordersRef.orderBy('createDate', 'desc');

    let listOrders = [];

    ordersRef.onSnapshot((orders) => {
      listOrders = orders.docs.map((item) => {
        return {
          id: item.id,
          ...item.data(),
        };
      });
      console.log('listOrders =>', listOrders);
      return dispatch({type: GET_ORDERS, payload: listOrders});
    });
    setLoading(false, dispatch);
  } catch (error) {
    console.log('error getOrders ==>', error);
  }
};

export const getDeviceInfo = (dispatch) => {
  return new Promise((resolve) => {
    let deviceInfo = {};

    try {
      deviceInfo.bundleId = DeviceInfo.getBundleId();
      deviceInfo.buildNumber = DeviceInfo.getBuildNumber();
      deviceInfo.version = DeviceInfo.getVersion();
      deviceInfo.readableVersion = DeviceInfo.getReadableVersion();

      let bundleSplit = deviceInfo.bundleId.split('.');
      let bundleType = bundleSplit[2];

      if (bundleType === 'client' || bundleType === 'clientstaging') {
        deviceInfo.appType = 'client';
      } else if (bundleType === 'expert' || bundleType === 'expertstaging') {
        deviceInfo.appType = 'expert';
      }
      return resolve(dispatch({type: DEVICE_INFO, payload: deviceInfo}));
    } catch (e) {
      console.log('Trouble getting device info ', e);
    }
  });
};

export const getExpertActiveOrders = (dispatch) => {
  // let expertActivities = getStore().currentUser.user.expertActivities;
  console.log('===> getExpertActiveOrders');
  const uid = auth().currentUser.uid;
  console.log(' getStore().currentUser.auth.uid', uid);

  let ordersRef = firestore()
    .collection('orders')
    .where('status', '>=', 1)
    .where('status', '<=', 4);

  ordersRef.where('experts.uid', '==', uid);

  let listOrders = [];

  ordersRef.onSnapshot((orders) => {
    console.log('=> orders', orders);

    listOrders = orders.docs.map((item) => {
      return {
        id: item.id,
        ...item.data(),
      };
    });
    return dispatch({type: GET_EXPERT_OPEN_ORDERS, payload: listOrders});
  });
};
export const getExpertOpenOrders = (activity, dispatch) => {
  let ordersRef = firestore()
    .collection('orders')
    .where('status', '==', 0)
    .where('servicesType', 'array-contains-any', activity);
  ordersRef.orderBy('createDate', 'desc');

  let listOrders = [];

  ordersRef.onSnapshot((orders) => {
    listOrders = orders.docs.map((item) => {
      return {
        id: item.id,
        ...item.data(),
      };
    });
    return dispatch({type: GET_EXPERT_ACTIVE_ORDERS, payload: listOrders});
  });
};

export const assingExpert = async (user, order, dispatch) => {
  try {
    console.log(user, order, dispatch);
    console.log('order ===>', order);
    console.log('order ===>', order);

    const experts = user;

    const ref = firestore().collection('orders').doc(order.id);
    await ref.set(
      {
        status: 1,

        experts,
      },
      {merge: true},
    );
  } catch (error) {
    console.error('assingExpert ==>', error);
  }
};
export const sendCoordinate = async (data, typeData, dispatch) => {
  const currentUser = auth().currentUser;
  try {
    setLoading(true, dispatch);
    const userRef = firestore().collection('users').doc(currentUser.uid);
    await userRef.set(
      {
        [typeData]: data,
      },
      {merge: true},
    );

    setLoading(false, dispatch);
  } catch (error) {
    setLoading(false, dispatch);
    console.log('error', error);
  }
};
export const updateStatus = async (status, id, dispatch) => {
  try {
    setLoading(true, dispatch);
    const ref = firestore().collection('orders').doc(id);
    await ref.set(
      {
        status,
      },
      {merge: true},
    );
    setLoading(false, dispatch);
  } catch (error) {
    setLoading(false, dispatch);

    console.error('updateStatus ==>', error);
  }
};
