import {
  GET_GALLERY,
  HANDLE_ERROR,
  LOADING,
  GET_COVERAGE,
  GET_ORDERS,
  DEVICE_INFO,
  GET_EXPERT_ACTIVE_ORDERS,
  GET_EXPERT_OPEN_ORDERS,
  GET_NAME_SERVICE,
  GET_CONFIG,
  ADD_PRODUCT_ADDRESS,
} from './types';

import firestore from '@react-native-firebase/firestore';
import DeviceInfo from 'react-native-device-info';
import auth from '@react-native-firebase/auth';
import axios from 'axios';
import {Alert} from 'react-native';

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
export const sendPushFcm = (fcm, notification, data) => {
  console.log('fcm =>', fcm);
  fetch('https://fcm.googleapis.com/fcm/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization:
        'key=AAAAKBT0Dt4:APA91bEFw5WX5PdNrg-I7C3lWdc1P7lOno7V-jLarijN6jp5VZIFpzOyV-9e5XC2qkGEW5YFQ7M2oUUCpYihRIXZMclZIQHemle-hOWHvRinCWH5HT2hS_nXImJa92cUWBcciL-_G3cE',
    },
    body: JSON.stringify({
      to: `/fcm/${fcm}`,
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
  const uid = auth().currentUser ? auth().currentUser.uid : null;
  if (uid) {
    try {
      setLoading(true, dispatch);
      const ordersRef = firestore()
        .collection('orders')
        .where('client.uid', '==', uid);
      ordersRef.orderBy('createDate', 'desc');

      ordersRef.onSnapshot((orders) => {
        let listOrders = orders.docs.map((item) => {
          return {
            id: item.id,
            ...item.data(),
          };
        });
        return dispatch({type: GET_ORDERS, payload: listOrders});
      });
      setLoading(false, dispatch);
    } catch (error) {
      setLoading(false, dispatch);

      console.log('error getOrders ==>', error);
    }
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

export const getExpertActiveOrders = (user, dispatch) => {
  let ordersRef = firestore()
    .collection('orders')
    .where('expertsUid', 'array-contains', user.uid);

  let listOrders = [];

  ordersRef.onSnapshot((orders) => {
    listOrders = orders.docs.map((item) => {
      return {
        id: item.id,
        ...item.data(),
      };
    });

    dispatch({
      type: GET_EXPERT_OPEN_ORDERS,
      payload: listOrders,
    });
  });
};

export const getExpertOpenOrders = (activity, dispatch) => {
  try {
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

      dispatch({type: GET_EXPERT_ACTIVE_ORDERS, payload: listOrders});
    });
  } catch (error) {
    console.log('error get open order ==>', error);
  }
};

export const assignExpert = async (user, order, dispatch) => {
  const assingExpertUrl =
    'https://us-central1-lafemme-5017a.cloudfunctions.net/assignExpert';
  try {
    console.warn('active assign');
    setLoading(true, dispatch);

    const res = await axios.post(assingExpertUrl, {
      expert: user,
      idOrder: order,
    });
    console.log('status ==>', res.status);
    console.log('ress ==>', res.data.msn);
    if (res.status === 200) {
      if (!res.data.status) {
        setLoading(false, dispatch);
        return Alert.alert('Ups', res.data.msn);
      }
    }

    setLoading(false, dispatch);
  } catch (error) {
    setLoading(false, dispatch);
    return console.error('assignExpert ==>', error);
  }
};
export const sendCoordinate = async (data, typeData, dispatch) => {
  const currentUser = auth().currentUser;
  try {
    setLoading(true, dispatch);
    const userRef = firestore().collection('users').doc(currentUser?.uid);
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
export const updateStatus = async (status, order, dispatch) => {
  try {
    setLoading(true, dispatch);

    const ref = firestore().collection('orders').doc(order.id);

    await ref.set({status}, {merge: true});
    setLoading(false, dispatch);
  } catch (error) {
    setLoading(false, dispatch);

    console.error('updateStatus ==>', error);
  }
};

export const addImageGallery = async (data, id, dispatch) => {
  try {
    setLoading(true, dispatch);
    const userRef = firestore().collection('gallery').doc(id);
    await userRef.set(data);
    await getGallery(dispatch);
    setLoading(false, dispatch);
  } catch (error) {
    setLoading(false, dispatch);
    console.log('error', error);
  }
};
export const userRating = async (uid, rating, dispatch) => {
  try {
    setLoading(true, dispatch);
    const userRef = firestore().collection('users').doc(uid);
    await userRef.set(
      {
        rating,
      },
      {merge: true},
    );

    setLoading(false, dispatch);
  } catch (error) {
    setLoading(false, dispatch);
    console.log('error', error);
  }
};

export const updateNote = async (id, note, type, dispatch) => {
  try {
    setLoading(true, dispatch);
    const orderRef = firestore().collection('orders').doc(id);

    await orderRef.set(
      {
        [type]: note,
      },
      {merge: true},
    );

    setLoading(false, dispatch);
  } catch (error) {
    setLoading(false, dispatch);
    console.log('error:updateNote ==>', error);
  }
};
export const activeNameSlug = async (activity, dispatch) => {
  try {
    setLoading(true, dispatch);
    let nameDate = [];
    const ref = await firestore().collection('services').get();

    const data = ref.docs.map((doc) => {
      const item = doc.data();
      return {
        ...item,
        id: doc.id,
      };
    });
    await activity.forEach((element) => {
      const result = data.filter((item) => item.slug === element);
      nameDate.push(result);
    });
    dispatch({type: GET_NAME_SERVICE, payload: nameDate});

    setLoading(false, dispatch);
  } catch (error) {
    setLoading(false, dispatch);

    console.log('activeNameSlug error', error);
  }
};

export const onDeleteGallery = async (id, dispatch) => {
  try {
    setLoading(true, dispatch);
    await firestore().collection('gallery').doc(id).delete();
    await getGallery(dispatch);
    setLoading(false, dispatch);
  } catch (error) {
    setLoading(false, dispatch);
    console.log('onDeleteGallery error', error);
  }
};

export const resetReducer = (dispatch) => {
  dispatch({type: GET_ORDERS, payload: []});
};

export const addService = async (uid, calcu, dispatch) => {
  try {
    setLoading(true, dispatch);

    const ref = firestore().collection('users').doc(uid);

    await ref.set(
      {
        numberOfServices: calcu,
      },
      {merge: true},
    );
    setLoading(false, dispatch);
  } catch (error) {
    console.log('error addService ==>', error);
    setLoading(false, dispatch);
  }
};

export const valdiateCouponDb = async (coupon, dispatch) => {
  try {
    const coupons = await firestore()
      .collection('coupon')
      .where('coupon', '==', coupon)
      .where('isEnabled', '==', true)
      .get();
    const data = coupons.docs.map((doc) => {
      const item = doc.data();

      return {
        ...item,
        id: doc.id,
      };
    });

    let cuoponRes = data.filter((c) => c.existence > 0);
    let dataRes = cuoponRes.length > 0 ? cuoponRes[0] : null;

    return dataRes;
  } catch (error) {
    console.log('error valdiateCoupon ==>', error);
  }
};
export const addCoupon = async (id, math, dispatch) => {
  try {
    setLoading(true, dispatch);

    const ref = firestore().collection('coupon').doc(id);

    await ref.set(
      {
        existence: math,
      },
      {merge: true},
    );
    setLoading(false, dispatch);
  } catch (error) {
    console.log('error add cuopon ==>', error);
    setLoading(false, dispatch);
  }
};

export const sendOrderService = async (data, user, dispatch) => {
  try {
    firestore()
      .collection('orders')
      .doc(data.id)
      .set(data)
      .then(function () {
        console.log('order:Created');
        let servicesPush = [];
        for (let i = 0; i < data.services.length; i++) {
          if (servicesPush.indexOf(data.services[i].name) === -1) {
            if (i === data.services.length - 1) {
              servicesPush = [
                ...servicesPush,
                ` y ${user.cart.services[i].name}`,
              ];
            } else {
              servicesPush = [
                ...servicesPush,
                ` ${user.cart.services[i].name}`,
              ];
            }
          }
        }
        let notification = {
          title: 'Nueva orden de servicio La Femme',
          body: `-Cuándo: ${data.date}.\n-Dónde: ${data.address.locality}-${
            data.address.neighborhood
          }.\n-Servicios: ${servicesPush.toString()}.`,
          content_available: true,
          priority: 'high',
        };
        let dataPush = null;
        topicPush('expert', notification, dataPush);
      })
      .catch(function (error) {
        console.error('Error saving order : ', error);
      });
  } catch (error) {
    console.log('sendOrder:error', error);
  }
};

export const assingExpertService = async (order, expert, dispatch) => {
  try {
    setLoading(true, dispatch);

    const ref = firestore().collection('orders').doc(order.id);
    await ref.set(order, {merge: true});
    setLoading(false, dispatch);
  } catch (error) {
    setLoading(false, dispatch);

    console.lgo('error ==>', error);
    Alert.alert('Ups', 'ocurrio un error inesperado');
  }
};

export const updateOrder = async (order, dispatch) => {
  try {
    console.log('updateOrder');
    setLoading(true, dispatch);

    const ref = firestore().collection('orders').doc(order.id);
    await ref.set(order, {merge: true});

    setLoading(false, dispatch);
  } catch (error) {
    setLoading(false, dispatch);
    console.log('error updateOrder==>', error);
  }
};
export const updateStatusDb = async (order, status, dispatch) => {
  try {
    setLoading(true, dispatch);
    const ref = firestore().collection('orders').doc(order.id);

    await ref.set({status}, {merge: true});
    setLoading(false, dispatch);
  } catch (error) {
    console.log('error ==>', error);
    setLoading(false, dispatch);
  }
};
export const getConfig = async (dispatch) => {
  try {
    setLoading(true, dispatch);
    const ref = await firestore().collection('config').doc('globals').get();
    setLoading(false, dispatch);
    dispatch({type: GET_CONFIG, payload: ref.data()});
  } catch (error) {
    console.log('error ==>', error);
    setLoading(false, dispatch);
  }
};

export const productViewAddress = (product, bool, dispatch) => {
  dispatch({type: ADD_PRODUCT_ADDRESS, payload: {view: bool, product}});
};
