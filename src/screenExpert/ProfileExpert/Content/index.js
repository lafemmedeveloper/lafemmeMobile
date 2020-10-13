import React, {useContext, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Linking,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import StarRating from 'react-native-star-rating';
import WebView from 'react-native-webview';
import Share from 'react-native-share';
import Rate, {AndroidMarket} from 'react-native-rate';
import UpdatePassword from './Modals/UpdatePassword';
import Header from '../Header';
import {Colors, Fonts, Metrics} from '../../../themes';
import ItemProfile from '../../../components/ItemProfile';
import {setLoading, signOff, updateProfile} from '../../../flux/auth/actions';
import ModalApp from '../../../components/ModalApp';
import ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import {firebase} from '@react-native-firebase/storage';
import utilities from '../../../utilities';
import GalleryExpert from './Modals/GalleryExpert';
import {StoreContext} from '../../../flux';

const Content = () => {
  const {state, authDispatch} = useContext(StoreContext);
  const {util, auth} = state;
  const {activity, deviceInfo} = util;
  const {user} = auth;

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

  const [modalPassword, setModalPassword] = useState(false);
  const [tyc, seTyc] = useState(false);
  const [value, setValue] = useState(modelState);
  const [imageUri, setImageUri] = useState(null);
  const [galleryModal, setGalleryModal] = useState(false);

  const logout = () => {
    Alert.alert(
      'Oye!',
      'Realmente deseas cerrar sesión.',
      [
        {
          text: 'Cerrar',
          onPress: () => {
            signOff(authDispatch);
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
  };

  const pickImage = () => {
    //setLoading(true);
    ImagePicker.showImagePicker(options, async (response) => {
      if (response.didCancel) {
        console.log('Ups...', 'You cancelled image picker 😟');
        //setLoading(false);
      } else if (response.error) {
        Alert.alert('Ups...', 'And error occured: ', response.error);
        // setLoading(false);
      } else {
        await setImageUri(response.uri);

        uploadImage();
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
  return (
    <>
      <View style={styles.container}>
        <Header title={'Perfil y configuración'} />
        <ScrollView
          style={{
            flex: 1,
          }}>
          <View>
            {user && user.imageUrl && (
              <View style={styles.containerImageProfile}>
                <View>
                  <TouchableOpacity onPress={() => pickImage()}>
                    <FastImage
                      style={styles.containerImage}
                      source={{uri: user ? user.imageUrl.medium : ''}}
                      resizeMode={FastImage.resizeMode.cover}
                    />
                  </TouchableOpacity>
                  {user && (
                    <>
                      <Text
                        style={[
                          Fonts.style.regular(
                            Colors.dark,
                            Fonts.size.medium,
                            'center',
                          ),
                          {marginTop: 2.5},
                        ]}>
                        {'Calificación '} {user.rating.toFixed(1)}
                      </Text>

                      <StarRating
                        disabled={true}
                        maxStars={5}
                        rating={user.rating ? parseFloat(user.rating) : 5}
                        starSize={15}
                        emptyStarColor={Colors.gray}
                        fullStarColor={Colors.client.primaryColor}
                        halfStarColor={Colors.client.secondaryColor}
                      />
                    </>
                  )}
                </View>

                <View style={styles.containerRating}>
                  <Text
                    style={[
                      {marginBottom: 5},
                      Fonts.style.semiBold(Colors.dark, Fonts.size.h6),
                      'center',
                    ]}>
                    Actividades
                  </Text>
                  {activity && activity.length > 0 ? (
                    activity.map((item, index) => {
                      return (
                        <View
                          key={index}
                          style={{
                            marginVertical: 2.5,
                            borderRadius: 15,
                            backgroundColor: Colors.expert.primaryColor,
                          }}>
                          <Text
                            style={[
                              Fonts.style.regular(
                                Colors.light,
                                Fonts.size.small,
                              ),
                              'center',
                              {
                                paddingHorizontal: 10,
                              },
                            ]}>
                            {utilities.capitalize(item[0].name)}
                          </Text>
                        </View>
                      );
                    })
                  ) : (
                    <ActivityIndicator color={Colors.expert.primaryColor} />
                  )}
                </View>
              </View>
            )}
          </View>

          <View //items
            style={styles.profileContainer}>
            <ItemProfile
              title={`${user.firstName} ${user.lastName}`}
              icon={'user'}
              decorationLine={true}
            />
            <ItemProfile
              title={`${user.email}`}
              icon={'envelope'}
              decorationLine={true}
            />

            <ItemProfile
              arrow={true}
              title={'Actualizar contraseña'}
              icon={'lock'}
              action={() => {
                setModalPassword(true);
              }}
              decorationLine={true}
            />
            <ItemProfile
              arrow={true}
              title={'Galería INSPO'}
              icon={'images'}
              action={() => {
                setGalleryModal(true);
              }}
              decorationLine={true}
            />
            <ItemProfile
              arrow={true}
              title={'Comparte La Femme con tus amigos'}
              icon={'paper-plane'}
              action={() => {
                shareRecipe();
              }}
              decorationLine={true}
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
                seTyc(true);
              }}
              decorationLine={true}
            />

            <ItemProfile
              title={'Ayuda'}
              icon={'question-circle'}
              action={() => {
                seTyc(true);
              }}
              decorationLine={false}
            />
          </View>
          <View //logout
            style={[styles.profileContainer, {marginVertical: 40}]}>
            <ItemProfile
              title={'Cerrar Sesión'}
              icon={'sign-out-alt'}
              action={() => {
                logout();
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
      <ModalApp open={modalPassword} setOpen={setModalPassword}>
        <UpdatePassword user={user} />
      </ModalApp>
      <ModalApp open={tyc} setOpen={seTyc}>
        <View style={{height: '90%'}}>
          <WebView
            WebView={true}
            source={{uri: 'https://lafemme.com.co/terminos-y-condiciones/'}}
            // renderLoading={this.renderLoadingView}
            startInLoadingState={true}
            style={{
              width: Metrics.screenWidth,
              alignSelf: 'center',
              flex: 1,
            }}
          />
        </View>
      </ModalApp>
      <ModalApp open={galleryModal} setOpen={setGalleryModal}>
        <GalleryExpert user={user} services={activity} />
      </ModalApp>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light,
  },
  containerImage: {
    height: 100,
    width: 100,
    borderRadius: 50,
  },
  containerRating: {alignItems: 'center'},
  containerImageProfile: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    marginHorizontal: 25,
    marginVertical: 20,
  },
  activity: {
    backgroundColor: Colors.expert.primaryColor,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
});
export default Content;
