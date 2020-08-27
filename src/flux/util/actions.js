import {GET_GALLERY, HANDLE_ERROR, LOADING, GET_COVERAGE} from './types';

import firestore from '@react-native-firebase/firestore';

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
  const coverageZones = await firestore()
    .collection('coverageZones')
    .get()
    .then('isActive', '===', true)
    .then('city', '===', city);

  const data = coverageZones.docs.map((doc) => {
    const item = doc.data();
    return {
      ...item,
      id: doc.id,
    };
  });

  return dispatch({type: GET_COVERAGE, payload: data});
};
