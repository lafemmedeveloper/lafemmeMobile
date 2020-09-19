import React, {useState} from 'react';
import {
  Alert,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';

import ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import utilities from '../../../../../utilities';
import {Colors, Fonts} from '../../../../../themes';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {firebase} from '@react-native-firebase/storage';

const ModalPhoto = (props) => {
  const {
    updateUser,
    utilDispatch,
    user,
    setLoading,
    close,
    changeStatus,
  } = props;
  const options = {
    title: 'Selecciona o toma una imagen',
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
  };
  const modelState = {
    images: [],
  };

  const [value, setValue] = useState(modelState);
  const [imageUri, setImageUri] = useState(null);
  const [imgSource, setImgSource] = useState(null);

  const pickImage = () => {
    //setLoading(true);
    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
        console.log('Ups...', 'You cancelled image picker 😟');
        //setLoading(false);
      } else if (response.error) {
        Alert.alert('Ups...', 'And error occured: ', response.error);
        // setLoading(false);
      } else {
        const source = {uri: response.uri};
        setImageUri(response.uri);
        setImgSource(source);
      }
    });
  };

  const uploadImage = async () => {
    console.log('imageUri ==>', imageUri);
    const ext = imageUri.split('.').pop(); // Extract image extension
    console.log('ext ==>', ext);
    const filename = `${utilities.create_UUID()}.${ext}`; // Generate unique name
    setValue({...value, uploading: true});
    await prepareImage(user.uid, filename);
  };
  const prepareImage = async (uid, filename) => {
    setLoading(true, utilDispatch);
    let picture = {
      thumbnail: null,
      small: null,
      medium: null,
      big: null,
      giant: null,
    };
    let x = imageUri;
    try {
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
                  setLoading(false, utilDispatch);
                  Alert.alert('Sorry, Try again.', error);
                },
              );
          } catch (error) {
            setLoading(false, utilDispatch);
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
            setLoading(false, utilDispatch);
            console.log('err', error);
          }
        })
        .catch((error) => {
          console.log('error', error);
          setLoading(false, utilDispatch);
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
            setLoading(false, utilDispatch);
            console.log('err', error);
          }
        })
        .catch((error) => {
          setLoading(false, utilDispatch);
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
            setLoading(false, utilDispatch);
          }
        })
        .catch((error) => {
          console.log('error', error);
          setLoading(false, utilDispatch);
        });
      ImageResizer.createResizedImage(x, 1024, 1024, 'JPEG', 30, 0)
        .then((RES) => {
          console.log('RES 1024', RES);

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
          setLoading(false, utilDispatch);
        });

      await close(false);

      changeStatus(5);
    } catch (error) {
      console.log('error prepareImage => ', error);
    }
  };

  console.log('value ==>', value);

  return (
    <View style={styles.container}>
      <Icon
        name={'images'}
        color={Colors.client.primaryColor}
        size={40}
        style={{alignSelf: 'center', marginVertical: 20}}
      />
      <Text style={Fonts.style.bold(Colors.dark, Fonts.size.h6, 'center')}>
        {'Galeria '}
      </Text>

      <Text
        style={[
          Fonts.style.light(Colors.data, Fonts.size.small, 'center'),
          {marginHorizontal: 50, marginBottom: 20},
        ]}>
        {'Agrega foto de tus servicios para que otros usuarios puedan verlo'}
      </Text>

      <View style={styles.logic}>
        {imgSource && <Image source={imgSource} style={styles.img} />}
        {imgSource ? (
          <TouchableOpacity style={styles.btn} onPress={() => uploadImage()}>
            <Text
              style={[
                Fonts.style.bold(Colors.light, Fonts.size.input, 'center'),
              ]}>
              {'Subir'}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.btn} onPress={() => pickImage()}>
            <Text
              style={[
                Fonts.style.bold(Colors.light, Fonts.size.input, 'center'),
              ]}>
              {'Abrir camara o galleria'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {height: '80%', marginTop: 20},
  btn: {
    backgroundColor: Colors.client.primaryColor,
    width: '90%',
    height: 40,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  logic: {justifyContent: 'center', alignItems: 'center', flex: 1},

  img: {resizeMode: 'contain', height: 100, width: 100, marginVertical: 20},
});
export default ModalPhoto;
