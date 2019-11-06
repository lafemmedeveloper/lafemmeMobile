import {SET_AUTH, USER_ACCOUNT, LOG_OUT, UPDATE_PROFILE} from './Types';
import {store, persistor} from '../../Core';

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
export const setAuth = state => dispatch => {
  dispatch({type: SET_AUTH, payload: state});
};

export const setAccount = () => (dispatch, getStore) => {
  return new Promise(resolve => {
    const userRef = firestore()
      .collection('users')
      .doc(getStore().currentUser.auth.uid);

    userRef.onSnapshot(_user => {
      return resolve(dispatch({type: USER_ACCOUNT, payload: _user.data()}));
    });
  });
};

export const logOut = () => dispatch => {
  console.log('logout');
  persistor.purge();
  // persistStore(this.props).purge();

  return auth()
    .signOut()
    .then(() => {
      console.log(' Sign-out successful.');
      return dispatch({type: LOG_OUT, payload: null});
    })
    .catch(error => {
      console.log('error:logout', error);
    });
};

export const updateProfile = (data, typeData) => async (dispatch, getStore) => {
  try {
    const userRef = firestore()
      .collection('users')
      .doc(getStore().currentUser.auth.uid);
    // console.log('typeData', typeData);
    await userRef.set(
      {
        [typeData]: data,
      },
      {merge: true},
    );
    dispatch({type: UPDATE_PROFILE});
  } catch (error) {
    console.log('error', error);
  }
};
