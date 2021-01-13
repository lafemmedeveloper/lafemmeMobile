import React, {useContext, useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import {
  ApplicationStyles,
  Colors,
  Fonts,
  Images,
  Metrics,
} from '../../../../../themes';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {StoreContext} from '../../../../../flux';
import {
  addImageGallery,
  getGallery,
  onDeleteGallery,
  setLoading,
} from '../../../../../flux/util/actions';
import FastImage from 'react-native-fast-image';
import moment from 'moment';

import {firebase} from '@react-native-firebase/storage';

import ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import utilities from '../../../../../utilities';
import Loading from '../../../../../components/Loading';
import _ from 'lodash';
import ModalApp from '../../../../../components/ModalApp';
import UploadPhoto from './UploadPhoto';

const GalleryExpert = (props) => {
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

  const initial_state = {
    thumbnail: null,
    small: null,
    medium: null,
    big: null,
    giant: null,
  };
  const modelState = {
    images: [],
  };
  const {user, services} = props;
  const {state, utilDispatch} = useContext(StoreContext);
  const {util} = state;
  const {gallery} = util;

  let [galleryUid, setGalleryUid] = useState([]);

  const [value, setValue] = useState(modelState);
  const [imageUri, setImageUri] = useState(null);
  const [uploadModal, setUploadModal] = useState(false);
  const [imageSource, setImageSource] = useState(null);
  const [serviceName, setServiceName] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [pictures, setPictures] = useState(initial_state);

  useEffect(() => {
    getGallery(utilDispatch);
  }, [utilDispatch]);
  useEffect(() => {
    let insert = gallery.filter((i) => i.expertUid === user.uid);

    setGalleryUid(insert);
  }, [gallery, user.uid]);

  const pickImage = () => {
    ImagePicker.showImagePicker(options, async (response) => {
      if (response.didCancel) {
        console.log('Ups...', 'You cancelled image picker 😟');
      } else if (response.error) {
        Alert.alert('Ups...', 'And error occured: ', response.error);
      } else {
        const source = {uri: response.uri};
        setImageSource(source);
        setImageUri(response.uri);
      }
    });
  };

  const uploadImage = async () => {
    const ext = imageUri.split('.').pop(); // Extract image extension
    const filename = `${utilities.create_UUID()}.${ext}`; // Generate unique name

    setValue({...value, uploading: true});
    setLoading(true, utilDispatch);
    await prepareImage(user.uid, filename);
    setLoading(false, utilDispatch);
  };
  const prepareImage = async (uid, filename) => {
    let x = imageUri;
    try {
      ImageResizer.createResizedImage(x, 56, 56, 'JPEG', 30, 0)
        .then((RES) => {
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
                        picture = {...picture, giant: url};
                        updateUser(picture);
                        return setIsComplete(true);
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
    } catch (error) {
      console.log('error prepareImage => ', error);
      setLoading(false, utilDispatch);
    }
  };
  const updateUser = async (picture) => {
    let images = {...picture};

    const dataExpert = {
      expertUid: user.uid,
      expertName: user.firstName,
      expertImage: user.imageUrl.small,
      rating: user.rating,
      date: Date.now(),
      imageUrl: images,
      isApproved: false,
      id: utilities.create_UUID(),
      service: serviceName,
    };
    if (isComplete) {
      await addImageGallery(dataExpert, dataExpert.id, utilDispatch);
      setImageSource(null);
      setServiceName('');
    }
  };

  return (
    <>
      <View style={styles.conatiner}>
        <View opacity={0.0} style={ApplicationStyles.separatorLineMini} />

        <Image
          source={Images.inspo}
          style={{
            width: 50,
            height: 50,
            resizeMode: 'contain',
            alignSelf: 'center',
            marginBottom: 10,
            tintColor: Colors.expert.primaryColor,
          }}
        />
        <Text style={Fonts.style.bold(Colors.dark, Fonts.size.h6, 'center')}>
          {'Inspo'}
        </Text>

        <Text
          style={Fonts.style.light(Colors.data, Fonts.size.small, 'center')}>
          {'Sube tus trabajos para inspirar los clientes La Femme'}
        </Text>
        <View opacity={0.0} style={ApplicationStyles.separatorLineMini} />
        {galleryUid && galleryUid.length === 0 && (
          <Text
            style={[
              Fonts.style.regular(Colors.dark, Fonts.size.h6, 'center'),
              {marginTop: 100},
            ]}>
            {'Lo siento aun no tienes imágenes de tu trabajo'}
          </Text>
        )}
        <ScrollView
          style={styles.contGallery}
          showsHorizontalScrollIndicator={false}>
          {galleryUid &&
            galleryUid.length > 0 &&
            galleryUid.map((item) => {
              _.orderBy(item, item.date, 'desc');

              return (
                <View key={item.id} style={styles.conCard}>
                  <TouchableOpacity
                    onPressOut={() =>
                      Alert.alert(
                        'Confirmación',
                        'realmente deseas eliminar esta imagen',
                        [
                          {
                            text: 'ELIMINAR',
                            onPress: async () => {
                              await onDeleteGallery(item.id, utilDispatch);
                            },
                          },
                          {
                            text: 'NO',
                          },
                        ],
                      )
                    }>
                    <FastImage
                      style={styles.img}
                      source={{uri: item.imageUrl.giant}}
                    />
                  </TouchableOpacity>
                  <View style={{marginLeft: 20, marginBottom: 40}}>
                    <Text
                      style={[
                        styles.date,
                        Fonts.style.bold(Colors.dark, Fonts.size.h6),
                      ]}>
                      {utilities.capitalize(item.service.split('-').join(' '))}
                    </Text>
                    <Text
                      style={[
                        styles.date,
                        Fonts.style.regular(Colors.dark, Fonts.size.medium),
                      ]}>
                      Creado: {moment(item.date).format('L')}
                    </Text>
                  </View>
                </View>
              );
            })}
        </ScrollView>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setUploadModal(true)}>
          <Text style={Fonts.style.bold(Colors.light, Fonts.size.medium)}>
            Cargar foto
          </Text>
        </TouchableOpacity>
      </View>
      <ModalApp open={uploadModal} setOpen={setUploadModal}>
        <UploadPhoto
          services={services}
          source={imageSource}
          serviceName={serviceName}
          uploadImage={uploadImage}
          pickImage={pickImage}
          setServiceName={setServiceName}
          close={setUploadModal}
        />
      </ModalApp>
      <Loading type="expert" />
    </>
  );
};
const styles = StyleSheet.create({
  conatiner: {height: Metrics.screenHeight - 60},
  button: {
    flex: 0,
    borderRadius: Metrics.textInBr,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '90%',
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: Colors.expert.primaryColor,
    marginBottom: Metrics.addFooter + 20,
    marginTop: 20,
  },

  contGallery: {
    alignSelf: 'center',
  },

  conCard: {},

  img: {
    width: Metrics.screenWidth * 0.9,
    height: Metrics.screenWidth * 0.9,
    alignSelf: 'center',
    marginHorizontal: 20,
    borderRadius: Metrics.borderRadius,
  },
  date: {},
});
export default GalleryExpert;
