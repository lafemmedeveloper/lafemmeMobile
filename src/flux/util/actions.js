import {
  GET_GALLERY,
  HANDLE_ERROR,
  LOADING,
  GET_COVERAGE,
  GET_ORDERS,
  DEVICE_INFO,
  GET_EXPERT_ACTIVE_ORDERS,
  GET_EXPERT_OPEN_ORDERS,
  GET_EXPERT_ORDER_HISTORY,
  GET_NAME_SERVICE,
} from './types';

import firestore from '@react-native-firebase/firestore';
import DeviceInfo from 'react-native-device-info';
import auth from '@react-native-firebase/auth';
import axios from 'axios';

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

export const getExpertActiveOrders = (dispatch) => {
  console.log('===> getExpertActiveOrders');
  const uid = auth().currentUser?.uid;

  let ordersRef = firestore()
    .collection('orders')
    .where('status', '>=', 1)
    .where('status', '<', 5);
  ordersRef.where('experts.uid', '==', uid);
  let listOrders = [];

  ordersRef.onSnapshot((orders) => {
    listOrders = orders.docs.map((item) => {
      return {
        id: item.id,
        ...item.data(),
      };
    });

    return dispatch({
      type: GET_EXPERT_OPEN_ORDERS,
      payload: listOrders.filter((o) => o.experts.uid === uid),
    });
  });
};

export const getExpertHistoryOrders = (dispatch) => {
  const uid = auth().currentUser.uid;

  let ordersRef = firestore().collection('orders').where('status', '>=', 5);

  ordersRef.where('experts.uid', '==', uid);

  let listOrders = [];

  ordersRef.onSnapshot((orders) => {
    listOrders = orders.docs.map((item) => {
      return {
        id: item.id,
        ...item.data(),
      };
    });

    return dispatch({type: GET_EXPERT_ORDER_HISTORY, payload: listOrders});
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

export const assignExpert = async (user, order, dispatch) => {
  const assingExpertUrl =
    'https://us-central1-lafemme-5017a.cloudfunctions.net/assignExpert';

  const updateOrderStatus =
    'https://us-central1-lafemme-5017a.cloudfunctions.net/updateOrderStatus';
  try {
    setLoading(true, dispatch);

    const res = await axios.post(assingExpertUrl, {
      expert: user,
      idOrder: order.id,
    });
    if (res.status === 200) {
      await axios.post(updateOrderStatus, {
        newOrderStatus: 1,
        order,
      });
    }
    setLoading(false, dispatch);
  } catch (error) {
    setLoading(false, dispatch);

    console.error('assignExpert ==>', error);
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
  const urlOrderStatus =
    'https://us-central1-lafemme-5017a.cloudfunctions.net/updateOrderStatus';

  try {
    setLoading(true, dispatch);

    await axios.post(urlOrderStatus, {
      newOrderStatus: status,
      order,
    });

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
  console.log('calcul number service ==>', calcu);
  console.log('uid==>', uid);

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
    console.log('dataRes ==>', dataRes);
    console.log('cuoponRes ==>', cuoponRes);
    console.log('coupons ==>', data);

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
