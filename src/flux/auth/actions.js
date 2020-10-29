import {SET_USER, HANDLE_ERROR, LOADING, DEL_USER} from './types';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {Alert} from 'react-native';
import messaging from '@react-native-firebase/messaging';

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
    dispatch({type: SET_USER, payload: data});
    setLoading(false, dispatch);
  } catch (error) {
    setLoading(false, dispatch);
    console.log(error);
  }
};

export const setUser = async (data, dispatch) => {
  console.log('active snapshot user');
  let usersRef = firestore().collection('users').doc(data);

  try {
    usersRef.onSnapshot((result) => {
      if (result.exists) {
        const user = result.data();
        dispatch({type: SET_USER, payload: user});
      } /*  else {
        const userData = {
          address: [],
          email: '',
          firstName: '',
          lastName: '',
          numberOfServices: 0,
          phone: currentUser.phoneNumber,
          uid: currentUser.uid,
          role: 'client',
          tyc: moment(new Date()).format('LLLL'),
          guest: [],
          rating: 5.0,
          cart: null,
          imageUrl: null,
          token: null,
        };
        //usersRef.set(userData);

        // dispatch({type: SET_USER, payload: userData});
      } */
    });
  } catch (error) {
    setLoading(false, dispatch);

    console.lgo('error', error);
  }
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
  if (currentUser && currentUser.uid) {
    try {
      setLoading(true, dispatch);
      const userRef = firestore().collection('users').doc(currentUser.uid);
      await userRef.set(
        {
          [typeData]: data,
        },
        {merge: true},
      );

      // await setUser(currentUser.uid, dispatch);
      setLoading(false, dispatch);
    } catch (error) {
      console.log('error', error);
      setLoading(false, dispatch);
    }
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

    setLoading(false, dispatch);
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

export const activeMessage = async (topic, dispatch) => {
  try {
    setLoading(true, dispatch);
    messaging()
      .subscribeToTopic(topic)
      .then(() => console.log('Subscribed to topic!'));
    messaging().onMessage(async (remoteMessage) => {
      console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log('push notification backgraund', remoteMessage);
    });
    sendTokenUser();
    setLoading(false, dispatch);
  } catch (error) {
    setLoading(false, dispatch);

    console.log('error activeMessage =>', error);
  }
};
const sendTokenUser = () => {
  messaging()
    .getToken()
    .then((token) => {
      return saveTokenToDatabase(token);
    });

  return messaging().onTokenRefresh((token) => {
    saveTokenToDatabase(token);
  });
};

const saveTokenToDatabase = async (token) => {
  const userId = auth().currentUser.uid;
  await firestore().collection('users').doc(userId).update({
    fcm: token,
  });
};

export const validateReferrals = async (number) => {
  try {
    const users = await firestore()
      .collection('users')
      .where('phone', '==', number.split(' ').join(''))
      .get();

    const data = users.docs.map((doc) => {
      const item = doc.data();

      return {
        ...item,
        id: doc.id,
      };
    });

    return data.length > 0 ? data[0] : null;
  } catch (error) {
    console.log('error ==>', error);
  }
};
export const adddReferralsUser = async (user, data, dispatch) => {
  try {
    setLoading(true, dispatch);
    const ref = firestore().collection('users').doc(user.uid);
    await ref.set(
      {
        referrals: [...user.referrals, data],
      },
      {merge: true},
    );
    setLoading(true, dispatch);
  } catch (error) {
    setLoading(false, dispatch);

    console.log('error', error);
  }
};
