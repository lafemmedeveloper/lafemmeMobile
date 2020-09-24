import {GET_USER, HANDLE_ERROR, LOADING, DEL_USER} from './types';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {Alert} from 'react-native';

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
  try {
    setLoading(true, dispatch);
    auth().onAuthStateChanged(function (user) {
      if (user) {
        setUser(user.uid, dispatch);
      }
    });
    setLoading(false, dispatch);
  } catch (error) {
    setLoading(false, dispatch);
    console.log('error observeUser =>', error);
  }
};
export const setUser = async (data, dispatch) => {
  let result = firestore().collection('users').doc(data);
  await result
    .get()
    .then((doc) => {
      setLoading(false, dispatch);
      if (!doc.exists) {
        console.log('No such document!');
        setLoading(false, dispatch);
      } else {
        const currentUserDb = doc.data();
        dispatch({type: GET_USER, payload: currentUserDb});
        setLoading(false, dispatch);
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
    await dispatch({type: DEL_USER});
    setLoading(false, dispatch);
  } catch (error) {
    console.log(error);
    setLoading(false, dispatch);
  }
};

export const updateProfile = async (data, typeData, dispatch) => {
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

    await setUser(currentUser.uid, dispatch);
    setLoading(false, dispatch);
  } catch (error) {
    setLoading(false, dispatch);
    console.log('error', error);
  }
};
export const Login = async (email, password, dispatch) => {
  try {
    setLoading(true, dispatch);

    console.log('Login =>');
    const currentUser = await auth().signInWithEmailAndPassword(
      email,
      password,
    );
    console.log('currentUser =>', currentUser);
    setLoading(true, dispatch);
  } catch (error) {
    if (
      error
        .toString()
        .includes('password is invalid or the user does not have a password.')
    ) {
      Alert.alert('Error de Autentificación', 'Tu contraseña es incorrecta');
    } else if (error.toString().includes('email address is badly formatted.')) {
      Alert.alert('Error de Autentificación', 'Revisa tu correo o contraseña');
    } else if (
      error.message
        .toString()
        .includes(
          'is no user record corresponding to this identifier. The user may have been deleted.',
        )
    ) {
      Alert.alert('Error de Autentificación', 'Al parecer no estas registrado');
    }
    setLoading(false, dispatch);
  }
};

export const updatePhoto = async (url, dispatch) => {
  try {
    setLoading(true, dispatch);
    const currentUser = auth().currentUser;
    await currentUser.updateProfile({
      photoURL: url,
    });
    const ref = firestore().collection('users').doc(currentUser.uid);
    await ref.set({imageUrl: url}, {merge: true});
    setUser(currentUser.uid, dispatch);
    setLoading(false, dispatch);
  } catch (error) {
    setLoading(false, dispatch);

    console.log('error updatePhoto=>', error);
  }
};

export const updateProfileItem = async (newData, uid, dispatch) => {
  try {
    setLoading(true, dispatch);

    const ref = firestore().collection('users').doc(uid);
    await ref.set(newData, {merge: true});
    await setUser(uid, dispatch);
    setLoading(false, dispatch);
  } catch (error) {
    console.log('error updateProfileItem =>', error);
    setLoading(false, dispatch);
  }
};
