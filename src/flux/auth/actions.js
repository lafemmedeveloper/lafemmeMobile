import {GET_USER, HANDLE_ERROR, LOADING, DEL_USER} from './types';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export const handleError = (dispatch) => {
  dispatch({type: HANDLE_ERROR, payload: true});
  setLoading(false, dispatch);
};

export const setLoading = (loading, dispatch) => {
  dispatch({type: LOADING, payload: loading});
};

export const saveUser = async (data, dispatch) => {
  try {
    setLoading(true, dispatch);
    const ref = firestore().collection('users').doc(data.uid);
    await ref.set(data);
    dispatch({type: GET_USER, payload: data});
    setLoading(false, dispatch);
  } catch (error) {
    setLoading(false, dispatch);
    console.log(error);
  }
};

export const observeUser = (dispatch) => {
  auth().onAuthStateChanged(function (user) {
    if (user) {
      setUser(user.uid, dispatch);
    }
  });
};
export const setUser = async (data, dispatch) => {
  let result = firestore().collection('users').doc(data);
  await result
    .get()
    .then((doc) => {
      if (!doc.exists) {
        console.log('No such document!');
      } else {
        const currentUserDb = doc.data();
        dispatch({type: GET_USER, payload: currentUserDb});
      }
    })
    .catch((error) => {
      setLoading(false, dispatch);
      console.log(error);
    });
};
export const signOff = async (dispatch) => {
  try {
    setLoading(true, dispatch);
    await auth().signOut();
    dispatch({type: DEL_USER});
    setLoading(false, dispatch);
  } catch (error) {
    console.log(error);
    setLoading(false, dispatch);
  }
};
export const addGuestDb = async (data, dispatch) => {
  const {user, guestUser} = data;
  try {
    setLoading(true, dispatch);
    const ref = firestore().collection('users').doc(user.uid);

    await ref.set({guest: [...user.guest, guestUser]}, {merge: true});

    await setUser(user.uid, dispatch);

    setLoading(false, dispatch);
  } catch (error) {
    console.log(error);
    setLoading(false, dispatch);
  }
};

export const updateUser = async (data, dispatch) => {
  const currentUser = auth().currentUser;
  try {
    setLoading(true, dispatch);
    const ref = firestore().collection('users').doc(currentUser.uid);

    await ref.set({guest: data}, {merge: true});

    await setUser(currentUser.uid, dispatch);

    setLoading(false, dispatch);
  } catch (error) {
    console.log(error);
    setLoading(false, dispatch);
  }
};
export const setUserCart = async (data, user, dispatch) => {
  try {
    const currentUser = auth().currentUser;
    setLoading(true, dispatch);
    const ref = firestore().collection('users').doc(currentUser.uid);
    console.log('cart:', [data]);
    ref.set({cart: [...user.cart, data]}, {merge: true});
    await setUser(currentUser.uid, dispatch);

    setLoading(false, dispatch);
  } catch (error) {
    console.log(error);
    setLoading(false, dispatch);
  }
};
export const updateProfile = async (data, typeData, dispatch) => {
  const currentUser = auth().currentUser;
  try {
    const userRef = firestore().collection('users').doc(currentUser.uid);
    await userRef.set(
      {
        [typeData]: data,
      },
      {merge: true},
    );

    setUser(currentUser.uid, dispatch);
  } catch (error) {
    console.log('error', error);
  }
};
