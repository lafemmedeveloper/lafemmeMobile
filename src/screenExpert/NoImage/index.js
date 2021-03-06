import React, {useState, useContext, useEffect} from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  StatusBar,
  Platform,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';

import ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import {firebase} from '@react-native-firebase/storage';

import {Images, Fonts, Colors, Metrics} from '../../themes';
import {StoreContext} from '../../flux';
import Icon from 'react-native-vector-icons/FontAwesome5';

import Utilities from '../../utilities';
import {signOff, updateProfile, setLoading} from '../../flux/auth/actions';
import Loading from '../../components/Loading';

const options = {
  title: 'Selecciona o toma una imagén',
  cancelButtonTitle: 'Cancelar',
  takePhotoButtonTitle: 'Tomar una fotografía',
  chooseFromLibraryButtonTitle: 'Selecciona de la galería',
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};
const modelState = {
  images: [],
};
const NoImage = () => {
  const {state, authDispatch} = useContext(StoreContext);
  const {auth} = state;
  const {user, loading} = auth;

  const [value, setValue] = useState(modelState);
  const [imageUri, setImageUri] = useState(null);
  const [imgSource, setImgSource] = useState('');
  const [coordinate, setCoordinate] = useState(null);

  const pickImage = () => {
    //setLoading(true);
    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
        console.log('Ups...', 'You cancelled image picker 😟');
        //setLoading(false);
      } else if (response.error) {
        Alert.alert('Ups...', 'And error occurred: ', response.error);
        // setLoading(false);
      } else {
        const source = {uri: response.uri};
        setImageUri(response.uri);
        setImgSource(source);
      }
    });
  };

  const uploadImage = async () => {
    const ext = imageUri.split('.').pop(); // Extract image extension
    const filename = `${Utilities.create_UUID()}.${ext}`; // Generate unique name
    setValue({...value, uploading: true});
    await prepareImage(user.uid, filename);
  };
  const prepareImage = async (uid, filename) => {
    setLoading(true, authDispatch);
    let picture = {
      thumbnail: null,
      small: null,
      medium: null,
      big: null,
      giant: null,
    };
    let x = imageUri;

    ImageResizer.createResizedImage(x, 56, 56, 'JPEG', 30, 0)
      .then((RES) => {
        console.log('RES 1000', RES);
        try {
          firebase
            .storage()
            .ref(`users/${uid}/thumbnail@${filename}`)
            .putFile(RES.path)
            .on(
              firebase.storage.TaskEvent.STATE_CHANGED,
              (snapshot) => {
                let state = {};
                state = {
                  ...state,
                  progress:
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100, // Calculate progress percentage
                };
                console.log('snapshot', snapshot);
                if (snapshot.state === firebase.storage.TaskState.SUCCESS) {
                  let allImages = value.images;
                  allImages.push(snapshot.downloadURL);
                  state = {
                    ...state,
                    uploading: false,
                    progress: 0,
                    images: allImages,
                  };

                  firebase
                    .storage()
                    .ref(`users/${uid}/thumbnail@${filename}`)
                    .getDownloadURL()
                    .then((url) => {
                      console.log('url:_large', url);
                      picture = {...picture, thumbnail: url};
                      updateUser(picture);
                    });
                }
                setValue(state);
              },
              (error) => {
                setLoading(false, authDispatch);
                Alert.alert('Sorry, Try again.', error);
              },
            );
        } catch (error) {
          setLoading(false, authDispatch);
          console.log('err', error);
        }
      })
      .catch((error) => {
        console.log('error', error);
      });

    ImageResizer.createResizedImage(x, 128, 128, 'JPEG', 30, 0)
      .then((RES) => {
        console.log('RES 1000', RES);
        try {
          firebase
            .storage()
            .ref(`users/${uid}/small@${filename}`)
            .putFile(RES.path)
            .on(
              firebase.storage.TaskEvent.STATE_CHANGED,
              (snapshot) => {
                let state = {};
                state = {
                  ...state,
                  progress:
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100, // Calculate progress percentage
                };
                console.log('snapshot', snapshot);
                if (snapshot.state === firebase.storage.TaskState.SUCCESS) {
                  let allImages = value.images;
                  allImages.push(snapshot.downloadURL);
                  state = {
                    ...state,
                    uploading: false,
                    progress: 0,
                    images: allImages,
                  };

                  firebase
                    .storage()
                    .ref(`users/${uid}/small@${filename}`)
                    .getDownloadURL()
                    .then((url) => {
                      console.log('url:small', url);
                      picture = {...picture, small: url};
                      updateUser(picture);
                    });
                }
                setValue(state);
              },
              (error) => {
                Alert.alert('Sorry, Try again.', error);
              },
            );
        } catch (error) {
          setLoading(false, authDispatch);
          console.log('err', error);
        }
      })
      .catch((error) => {
        console.log('error', error);
        setLoading(false, authDispatch);
      });
    ImageResizer.createResizedImage(x, 256, 256, 'JPEG', 30, 0)
      .then((RES) => {
        console.log('RES 1000', RES);
        try {
          firebase
            .storage()
            .ref(`users/${uid}/medium@${filename}`)
            .putFile(RES.path)
            .on(
              firebase.storage.TaskEvent.STATE_CHANGED,
              (snapshot) => {
                let state = {};
                state = {
                  ...state,
                  progress:
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100, // Calculate progress percentage
                };
                console.log('snapshot', snapshot);
                if (snapshot.state === firebase.storage.TaskState.SUCCESS) {
                  let allImages = value.images;
                  allImages.push(snapshot.downloadURL);
                  state = {
                    ...state,
                    uploading: false,
                    progress: 0,
                    images: allImages,
                  };

                  firebase
                    .storage()
                    .ref(`users/${uid}/medium@${filename}`)
                    .getDownloadURL()
                    .then((url) => {
                      console.log('url:medium', url);
                      picture = {...picture, medium: url};
                      updateUser(picture);
                    });
                }
                setValue(state);
              },
              (error) => {
                Alert.alert('Sorry, Try again.', error);
              },
            );
        } catch (error) {
          setLoading(false, authDispatch);
          console.log('err', error);
        }
      })
      .catch((error) => {
        setLoading(false, authDispatch);
        console.log('error', error);
      });
    ImageResizer.createResizedImage(x, 512, 512, 'JPEG', 30, 0)
      .then((RES) => {
        console.log('RES 1000', RES);
        try {
          firebase
            .storage()
            .ref(`users/${uid}/big@${filename}`)
            .putFile(RES.path)
            .on(
              firebase.storage.TaskEvent.STATE_CHANGED,
              (snapshot) => {
                let state = {};
                state = {
                  ...state,
                  progress:
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100, // Calculate progress percentage
                };
                console.log('snapshot', snapshot);
                if (snapshot.state === firebase.storage.TaskState.SUCCESS) {
                  let allImages = value.images;
                  allImages.push(snapshot.downloadURL);
                  state = {
                    ...state,
                    uploading: false,
                    progress: 0,
                    images: allImages,
                  };

                  firebase
                    .storage()
                    .ref(`users/${uid}/big@${filename}`)
                    .getDownloadURL()
                    .then((url) => {
                      console.log('url:big', url);
                      picture = {...picture, big: url};
                      updateUser(picture);
                    });
                }
                setValue(state);
              },
              (error) => {
                Alert.alert('Sorry, Try again.', error);
              },
            );
        } catch (error) {
          console.log('err', error);
          setLoading(false, authDispatch);
        }
      })
      .catch((error) => {
        console.log('error', error);
        setLoading(false, authDispatch);
      });
    ImageResizer.createResizedImage(x, 1024, 1024, 'JPEG', 30, 0)
      .then((RES) => {
        console.log('RES 1000', RES);
        try {
          firebase
            .storage()
            .ref(`users/${uid}/giant@${filename}`)
            .putFile(RES.path)
            .on(
              firebase.storage.TaskEvent.STATE_CHANGED,
              (snapshot) => {
                let state = {};
                state = {
                  ...state,
                  progress:
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100, // Calculate progress percentage
                };
                console.log('snapshot', snapshot);
                if (snapshot.state === firebase.storage.TaskState.SUCCESS) {
                  let allImages = value.images;
                  allImages.push(snapshot.downloadURL);
                  state = {
                    ...state,
                    uploading: false,
                    progress: 0,
                    images: allImages,
                  };

                  firebase
                    .storage()
                    .ref(`users/${uid}/giant@${filename}`)
                    .getDownloadURL()
                    .then((url) => {
                      console.log('url:giant', url);
                      picture = {...picture, giant: url};
                      updateUser(picture);
                    });
                }
                setValue(state);
              },
              (error) => {
                Alert.alert('Sorry, Try again.', error);
              },
            );
        } catch (error) {
          console.log('err', error);
        }
      })
      .catch((error) => {
        console.log('error', error);
        setLoading(false, authDispatch);
      });
  };

  const updateUser = async (picture) => {
    await updateProfile({...picture}, 'imageUrl', authDispatch);
  };
  const validateImage = async () => {
    if (imgSource === '') {
      Alert.alert(
        'Ups!',
        'Es necesario cargar una foto de perfil para continuar',
      );
    } else {
      await uploadImage();
    }
  };
  const currentCoordinate = () => {
    const config = {
      skipPermissionRequests: Platform.OS === 'ios' ? true : false,
      authorizationLevel: 'auto',
    };
    //Geolocation.requestAuthorization();

    Geolocation.setRNConfiguration(config);
    Geolocation.getCurrentPosition((info) =>
      setCoordinate({
        latitude: info.coords.latitude,
        longitude: info.coords.longitude,
      }),
    );
  };

  useEffect(() => {
    if (user && !user.coordinates) {
      currentCoordinate();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (user && coordinate) {
      updateProfile(coordinate, 'coordinates', authDispatch);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coordinate, user]);

  return (
    <>
      <Loading type={'expert'} loading={loading} />
      <StatusBar backgroundColor={'white'} barStyle={'dark-content'} />
      <View style={styles.container}>
        <View style={styles.contContainer}>
          <Text
            style={Fonts.style.regular(Colors.gray, Fonts.size.h6, 'center')}>
            Hola,{' '}
            <Text
              style={Fonts.style.semiBold(
                Colors.dark,
                Fonts.size.h6,
                'center',
              )}>
              {user && `${user.firstName} ${user.lastName}`}
            </Text>{' '}
            <Text
              style={Fonts.style.regular(Colors.gray, Fonts.size.h6, 'center')}>
              Para continuar tu experiencia La Femme es necesario subir tu foto
              de perfil.
            </Text>
          </Text>

          <View style={styles.contImage}>
            <Image
              style={styles.image}
              source={imgSource ? imgSource : Images.defaultUser}
            />
          </View>

          <TouchableOpacity onPress={() => pickImage()}>
            <Text
              style={Fonts.style.underline(
                Colors.expert.primaryColor,
                Fonts.size.h6,
                'center',
              )}>
              {'Tomar o cargar foto'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => validateImage()}
        style={[
          styles.btnContainer,
          {
            backgroundColor: Colors.expert.secondaryColor,
          },
        ]}>
        <Text
          style={Fonts.style.bold(Colors.light, Fonts.size.medium, 'center')}>
          {'Continuar'}
          {'  '}
          <Icon name={'arrow-right'} size={15} color={Colors.light} />
        </Text>
      </TouchableOpacity>
      <View
        style={{
          justifyContent: 'center',
          flexDirection: 'row',
          paddingBottom: Metrics.addFooter,
        }}>
        <TouchableOpacity onPress={() => signOff(authDispatch)}>
          <Text
            style={[
              Fonts.style.underline(
                Colors.expert.primaryColor,
                Fonts.size.medium,
                'center',
              ),
              {marginBottom: 40},
            ]}>
            {'Cerrar sesión'}
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},

  image: {alignSelf: 'center', resizeMode: 'cover', width: 200, height: 200},
  contImage: {marginVertical: 20},
  btnContainer: {
    flex: 0,
    height: 40,
    width: Metrics.contentWidth,
    alignSelf: 'center',
    borderRadius: Metrics.borderRadius,
    marginVertical: 20,

    justifyContent: 'center',
    alignItems: 'center',

    shadowColor: Colors.dark,
    shadowOffset: {
      width: 2,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 1,

    elevation: 5,
  },
  contContainer: {
    paddingHorizontal: 30,
    paddingVertical: 60,
    borderRadius: 10,
  },
  logout: {
    marginTop: 20,
  },
});

export default NoImage;
