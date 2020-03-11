import {
  SET_AUTH,
  USER_ACCOUNT,
  LOG_OUT,
  UPDATE_PROFILE,
  SET_TEMP_DATA,
} from './Types';
import {store, persistor} from '../../Core';

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import moment from 'moment';

export const setAuth = state => dispatch => {
  dispatch({type: SET_AUTH, payload: state});
};

export const setAccount = uid => (dispatch, getStore) => {
  return new Promise(resolve => {
    const usersRef = firestore()
      .collection('users')
      .doc(uid);

    usersRef.get().then(docSnapshot => {
      if (docSnapshot.exists) {
        usersRef.onSnapshot(_user => {
          return resolve(dispatch({type: USER_ACCOUNT, payload: _user.data()}));
        });
      } else {
        const {
          userEmail,
          userFirstName,
          userLastName,
          userPhone,
        } = getStore().currentUser.tempDataRegister;
        usersRef
          .set({
            uid: auth().currentUser ? auth().currentUser.uid : null,
            firstName: userFirstName,
            lastName: userLastName,
            numberOfServices: 0,
            phone: userPhone,
            email: userEmail,
            rating: 5.0,
            tyc: moment(new Date()).format('LLLL'),
            isAdmin: false,
            isPremium: false,
            isPremiumManual: false,
            address: [],
            guest: [],
            roles: ['client'],
            cart: null,
          })
          .then(function() {
            console.log('Document successfully written!');
            usersRef.onSnapshot(_user => {
              return resolve(
                dispatch({type: USER_ACCOUNT, payload: _user.data()}),
              );
            });
          })
          .catch(function(error) {
            console.error('Error writing document: ', error);
          });
      }
    });
  });
};

export const setTempRegister = data => dispatch => {
  console.log('setTempRegister', data);
  dispatch({type: SET_TEMP_DATA, payload: data});
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
