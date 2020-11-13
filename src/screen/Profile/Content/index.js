import React, {useContext, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Linking,
  Image,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';

import {Colors, Fonts, Images, Metrics} from '../../../themes';
import ItemProfile from '../../../components/ItemProfile';
import {signOff, setLoading, updateProfile} from '../../../flux/auth/actions';
import UpdateName from './Modals/UpdateName';
import UpdateEmail from './Modals/UpdateEmail';
import ModalApp from '../../../components/ModalApp';

import Address from '../../Address';
import Share from 'react-native-share';
import Rate, {AndroidMarket} from 'react-native-rate';
import WebView from 'react-native-webview';
import {firebase} from '@react-native-firebase/storage';

import ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import utilities from '../../../utilities';
import {resetReducer} from '../../../flux/util/actions';
import {StoreContext} from '../../../flux';
import Header from '../Header';
import Icon from 'react-native-vector-icons/FontAwesome5';
import UpdateImage from './Modals/UpdateImage';
import ModalRef from './Modals/ModalRef';

const modelState = {
  images: [],
};
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

const Content = (props) => {
  const {utilDispatch} = useContext(StoreContext);
  const {state, dispatch} = props;
  const {auth, util} = state;
  const {user} = auth;
  const {deviceInfo} = util;
  console.log('state', state);
  const [modalName, setModalName] = useState(false);
  const [modalEmail, setModalEmail] = useState(false);
  const [tyc, setTyc] = useState(false);

  const [modalAddress, setModalAddress] = useState(false);
  const [modalAddAddress, setModalAddAddress] = useState(false);

  const [value, setValue] = useState(modelState);
  const [imageUri, setImageUri] = useState(null);
  const [imgSource, setImgSource] = useState(null);
  const [modalImage, setModalImage] = useState(false);
  const [modalRef, setModalRef] = useState(false);

  const shareRecipe = async (type, data) => {
    console.log('shareItem:', type, data);
    let shareOptions;
    let title = 'La FemmeApp';

    switch (type) {
      case 'recipe':
        const url =
          'https://play.google.com/store/apps/details?id=co.net.lm.lafemmeclient';

        const message = 'Oye te invito a que descargues La Femme';

        shareOptions = Platform.select({
          ios: {
            activityItemSources: [
              {
                placeholderItem: {type: 'url', content: url},
                item: {
                  default: {type: 'url', content: url},
                },
                subject: {
                  default: title,
                },
                linkMetadata: {originalUrl: url, url, title},
              },
              {
                placeholderItem: {type: 'text', content: message},
                item: {
                  default: {type: 'text', content: message},
                  message: message,
                },
              },
            ],
          },
          default: {
            title: 'La FemmeApp',
            subject: 'La FemmeApp',
            failOnCancel: false,
            message: message,
          },
        });

        break;

      default:
        shareOptions = {
          title: 'La FemmeApp',
          message: 'Oye te invito a que descargues La Femme',
          url:
            'https://play.google.com/store/apps/details?id=co.net.lm.lafemmeclient',
        };

        break;
    }

    Share.open(shareOptions)
      .then((res) => {
        console.log('Share', res);
      })
      .catch((err) => {
        err && console.log('Share', err);
      });
  };
  const activeReview = () => {
    console.log('activeReview');
    let options = {
      AppleAppID: '1517296035',
      GooglePackageName: 'com.femme.clientstaging',
      AmazonPackageName: 'com.femme.clientstaging',
      OtherAndroidURL:
        'https://play.google.com/store/apps/details?id=co.net.lm.lafemmeclient',
      preferredAndroidMarket: AndroidMarket.Google,
      preferInApp: false,
      openAppStoreIfInAppFails: true,
      fallbackPlatformURL: 'https://lafemme.com.co/',
    };
    Rate.rate(options, (success) => {
      if (success) {
        console.log('rate:success', success);
        let name = `activeReview_${Platform.OS}`;
        let properties = {uid: user.uid};
        console.log('rate', name, properties);
        Alert.alert('Excelente', 'Gracias por calificarnos');
      } else {
        console.log('rate:NoSuccess', success);
      }
    });
  };
  const pickImage = async () => {
    ImagePicker.showImagePicker(options, async (response) => {
      if (response.didCancel) {
        console.log('Ups...', 'You cancelled image picker 😟');
      } else if (response.error) {
        Alert.alert('Ups...', 'And error occured: ', response.error);
      } else {
        const source = {uri: response.uri};
        setImageUri(response.uri);
        setImgSource(source);
      }
    });
  };

  const uploadImage = async () => {
    const ext = imageUri.split('.').pop(); // Extract image extension
    const filename = `${utilities.create_UUID()}.${ext}`; // Generate unique name
    setValue({...value, uploading: true});
    await prepareImage(user.uid, filename);
  };
  const prepareImage = async (uid, filename) => {
    setLoading(true, dispatch);
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
                setLoading(false, dispatch);
                Alert.alert('Sorry, Try again.', error);
              },
            );
        } catch (error) {
          setLoading(false, dispatch);
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
          setLoading(false, dispatch);
          console.log('err', error);
        }
      })
      .catch((error) => {
        console.log('error', error);
        setLoading(false, dispatch);
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
          setLoading(false, dispatch);
          console.log('err', error);
        }
      })
      .catch((error) => {
        setLoading(false, dispatch);
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
          setLoading(false, dispatch);
        }
      })
      .catch((error) => {
        console.log('error', error);
        setLoading(false, dispatch);
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
        setLoading(false, dispatch);
      });
  };

  const updateUser = async (picture) => {
    await updateProfile({...picture}, 'imageUrl', dispatch);
  };
  const signOffUser = async () => {
    resetReducer(utilDispatch);
    await signOff(dispatch);
  };

  return (
    <>
      <View style={styles.container}>
        <Header title={'Perfil y configuración'} />

        <ScrollView style={{marginTop: 20}}>
          <View //profile
            style={styles.profileContainer} //profile
          >
            <View>
              <TouchableOpacity
                style={styles.contUpdate}
                onPress={() => setModalImage(true)}>
                <Icon
                  name="sync-alt"
                  style={styles.update}
                  color={Colors.client.primaryColor}
                  size={15}
                />
              </TouchableOpacity>
              {user && user.imageUrl ? (
                <Image
                  source={{uri: user.imageUrl.medium}}
                  style={{
                    height: 100,
                    width: 100,
                    resizeMode: 'cover',
                    borderRadius: 50,
                  }}
                />
              ) : (
                <Image
                  source={Images.defaultUser}
                  style={{
                    height: 100,
                    width: 100,
                    resizeMode: 'cover',
                    borderRadius: 50,
                  }}
                />
              )}
            </View>

            <View style={styles.separator} />
            <Text
              style={Fonts.style.semiBold(
                Colors.dark,
                Fonts.size.h4,
                'center',
              )}>
              {`${user.firstName} ${user.lastName}`}
            </Text>

            {user.phone ? (
              <Text
                style={Fonts.style.regular(
                  Colors.dark,
                  Fonts.size.medium,
                  'center',
                )}>
                {user.phone}
              </Text>
            ) : (
              <Text
                style={Fonts.style.regular(
                  Colors.dark,
                  Fonts.size.medium,
                  'center',
                )}>
                No se ha registrado Telefono
              </Text>
            )}

            <Text
              style={Fonts.style.regular(
                Colors.dark,
                Fonts.size.medium,
                'center',
              )}>
              {user.email}
            </Text>
            <View style={styles.separator} />
          </View>
          <View //items
            style={styles.profileContainer}>
            <ItemProfile
              title={'Actualizar nombre'}
              icon={'user'}
              action={() => {
                setModalName(true);
              }}
              decorationLine={true}
            />
            <ItemProfile
              title={'Actualizar email'}
              icon={'envelope'}
              action={() => {
                setModalEmail(true);
              }}
              decorationLine={true}
            />

            <ItemProfile
              title={'Comparte La Femme con tus amigos'}
              icon={'paper-plane'}
              action={() => {
                shareRecipe();
              }}
              decorationLine={true}
            />
            <ItemProfile
              title={'Mis direcciones'}
              icon={'map-marker'}
              action={() => {
                setModalAddress(true);
              }}
              decorationLine={true}
            />

            <ItemProfile
              title={'Referidos'}
              icon={'exchange-alt'}
              action={() => {
                setModalRef(true);
              }}
              decorationLine={false}
            />
          </View>

          <View //Legals
            style={styles.profileContainer}>
            <ItemProfile
              title={'Califica tu experiencia'}
              icon={'star'}
              action={() => {
                activeReview();
              }}
              decorationLine={true}
            />
            <ItemProfile
              title={'Condiciones del servicio'}
              icon={'check-square'}
              action={() => {
                setTyc(true);
              }}
              decorationLine={true}
            />

            <ItemProfile
              title={'Ayuda'}
              icon={'question-circle'}
              action={() => {
                setTyc(true);
              }}
              decorationLine={false}
            />
          </View>
          <View //logout
            style={styles.profileContainer}>
            <ItemProfile
              title={'Cerrar Sesión'}
              icon={'sign-out-alt'}
              action={() => {
                Alert.alert(
                  'Hey!',
                  'Realmente deseas Cerrar Sesión',
                  [
                    {
                      text: 'Si',
                      onPress: () => {
                        signOffUser();
                      },
                    },
                    {
                      text: 'Cancelar',
                      onPress: () => console.log('Cancel Pressed'),
                      style: 'cancel',
                    },
                  ],
                  {cancelable: true},
                );
              }}
              decorationLine={false}
            />
          </View>
          <View //About
            style={styles.profileContainer}>
            <View style={styles.separator} />
            <Text
              style={Fonts.style.regular(
                Colors.dark,
                Fonts.size.small,
                'center',
              )}>
              La Femme Clientes
              {deviceInfo.bundleId === 'com.femme.clientstaging' && ' Staging'}
            </Text>
            <Text
              style={Fonts.style.regular(
                Colors.dark,
                Fonts.size.small,
                'center',
              )}>
              {deviceInfo.readableVersion}
            </Text>
            <TouchableOpacity
              onPress={() => {
                Linking.openURL(
                  'whatsapp://send?text=Me interesa contactar al desarrollador de La Femme &phone=+573106873181',
                );
              }}
              style={{marginVertical: 20}}>
              <Text
                style={Fonts.style.regular(
                  Colors.dark,
                  Fonts.size.tiny,
                  'center',
                )}>
                {'Desarrollado por'}
              </Text>
              <Text
                style={Fonts.style.bold(
                  Colors.dark,
                  Fonts.size.small,
                  'center',
                )}>
                {'@NiboStudio'}
              </Text>
            </TouchableOpacity>
            <View style={styles.separator} />
          </View>
        </ScrollView>
      </View>
      <ModalApp open={modalName} setOpen={setModalName}>
        <UpdateName user={user} setModalName={setModalName} />
      </ModalApp>
      <ModalApp open={modalEmail} setOpen={setModalEmail}>
        <UpdateEmail
          user={user}
          dispatch={dispatch}
          setModalEmail={setModalEmail}
        />
      </ModalApp>

      <ModalApp
        open={modalAddress}
        setOpen={modalAddAddress ? setModalAddAddress : setModalAddress}>
        <Address />
      </ModalApp>
      <ModalApp open={tyc} setOpen={setTyc}>
        <View style={{height: '90%'}}>
          <WebView
            WebView={true}
            source={{uri: 'https://lafemme.com.co/terminos-y-condiciones/'}}
            startInLoadingState={true}
            style={{
              width: Metrics.screenWidth,
              alignSelf: 'center',
              flex: 1,
            }}
          />
        </View>
      </ModalApp>
      <ModalApp open={modalImage} setOpen={setModalImage}>
        <UpdateImage
          source={imgSource}
          pickImage={pickImage}
          uploadImage={uploadImage}
          close={setModalImage}
        />
      </ModalApp>
      <ModalApp open={modalRef} setOpen={setModalRef}>
        <ModalRef user={user} />
      </ModalApp>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: Metrics.screenWidth,

    flexDirection: 'column',
    backgroundColor: Colors.light,
  },

  headerContainer: {
    flex: 0,
    width: Metrics.screenWidth,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  separator: {height: 20},
  profileContainer: {
    flex: 0,
    width: Metrics.screenWidth,
    borderBottomWidth: 10,
    borderBottomColor: Colors.disabledBtn,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contUpdate: {
    position: 'absolute',
    width: 25,
    height: 25,
    borderRadius: 20,
    zIndex: 20,
    backgroundColor: Colors.light,
    shadowColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,

    elevation: 6,
    alignSelf: 'flex-end',
    marginBottom: 5,
    bottom: 0,
    marginRight: 10,
  },
});

export default Content;
