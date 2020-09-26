import React, {useContext, useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {Colors, Fonts} from '../../../../../themes';
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
    title: 'Selecciona o toma una imagen',
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
  };
  const modelState = {
    images: [],
  };
  const {user, services} = props;
  const {state, utilDispatch} = useContext(StoreContext);
  const {util} = state;
  const {gallery, loading} = util;

  let [galleryUid, setGalleryUid] = useState([]);

  const [value, setValue] = useState(modelState);
  const [imageUri, setImageUri] = useState(null);
  const [uploadModal, setUploadModal] = useState(false);
  const [imageSource, setImageSource] = useState(null);
  const [serviceName, setServiceName] = useState('');

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
        await setImageUri(response.uri);
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
    } catch (error) {
      console.log('error prepareImage => ', error);
    }
  };
  const updateUser = async (picture) => {
    const images = {...picture};

    const dataExpert = {
      expertUid: user.uid,
      expertName: user.firstName,
      expertImage: user.imageUrl.small,
      rating: user.rating,
      date: moment().format(),
      imageUrl: images,
      isApproved: false,
      id: user.uid,
      service: serviceName,
    };
    await addImageGallery(dataExpert, dataExpert.id, utilDispatch);
    setImageSource(null);
    setServiceName('');
  };

  const deletePhoto = async (id) => {
    await onDeleteGallery(id, utilDispatch);
  };

  return (
    <>
      <Loading type={'expert'} loading={loading} />

      <View style={styles.conatiner}>
        <Icon
          name={'images'}
          size={50}
          color={Colors.expert.primaryColor}
          style={styles.icon}
        />
        <Text style={Fonts.style.bold(Colors.dark, Fonts.size.h6, 'center')}>
          {'Galeria Inspo'}
        </Text>
        <ScrollView horizontal style={styles.contGallery}>
          {galleryUid &&
            galleryUid.map((item) => {
              _.orderBy(item, item.date, 'desc');
              return (
                <View key={item.id}>
                  <View>
                    <FastImage
                      style={styles.img}
                      source={{
                        uri: item.imageUrl.medium,
                        priority: FastImage.priority.high,
                      }}
                      resizeMode={FastImage.resizeMode.contain}
                    />

                    <Text
                      style={[
                        Fonts.style.bold(Colors.dark, Fonts.size.medium),
                        {marginLeft: 20},
                      ]}>
                      {moment(item.date).format('ll')}
                    </Text>
                    <Text
                      style={[
                        Fonts.style.bold(Colors.dark, Fonts.size.medium),
                        {marginLeft: 20},
                      ]}>
                      {item.service}
                    </Text>
                  </View>
                  <View style={styles.contD}>
                    <View style={styles.contA}>
                      <View
                        style={
                          item.isApproved ? styles.approved : styles.noApproved
                        }>
                        <Text
                          style={[
                            Fonts.style.regular(
                              item.isApproved ? 'green' : 'red',
                              Fonts.size.small,
                            ),
                          ]}>
                          {item.isApproved ? 'Aprobado' : 'No Aprobado'}
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      style={styles.delete}
                      onPress={() =>
                        Alert.alert(
                          'Oye!',
                          'Realmente desea eliminar esta image de tu Galleria INSPO.',
                          [
                            {
                              text: 'Eliminar',
                              onPress: () => {
                                deletePhoto(item.id);
                              },
                            },
                            {
                              text: 'Cancelar',
                              onPress: () => console.log('Cancel Pressed'),
                              style: 'cancel',
                            },
                          ],
                          {cancelable: true},
                        )
                      }>
                      <Text
                        style={[
                          Fonts.style.regular(Colors.light, Fonts.size.medium),
                        ]}>
                        <Icon name={'trash-alt'} size={20} color={'red'} />
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
        </ScrollView>
        <View style={styles.conatinerBnt}>
          <TouchableOpacity
            style={styles.sendImg}
            onPress={() => setUploadModal(true)}>
            <Icon
              name={'camera'}
              size={30}
              color={Colors.expert.primaryColor}
            />
          </TouchableOpacity>
        </View>
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
    </>
  );
};
const styles = StyleSheet.create({
  conatiner: {height: '90%', paddingTop: 20},
  icon: {alignSelf: 'center', marginVertical: 20},
  img: {width: 200, height: 200},
  sendImg: {
    backgroundColor: Colors.light,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,

    elevation: 7,
  },
  conatinerBnt: {
    alignSelf: 'center',
  },
  approved: {
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 20,
  },
  noApproved: {
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15,
  },
  contA: {alignSelf: 'center'},
  contD: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
  },

  contGallery: {
    marginVertical: 20,
  },
  delete: {
    backgroundColor: Colors.light,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,

    elevation: 7,
  },
});
export default GalleryExpert;