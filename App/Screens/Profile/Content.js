//Modules
import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Linking,
  Alert,
  Image,
  Platform,
} from 'react-native';
import {Colors, Fonts, Metrics, Images} from '../../Themes';
import Rate, {AndroidMarket} from 'react-native-rate';
import Share from 'react-native-share';
import Modal from 'react-native-modal';
import auth from '@react-native-firebase/auth';
import {firebase} from '@react-native-firebase/storage';
import WebView from 'react-native-webview';
import ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';

import styles from './styles';
import Login from '../Login/Content';
import Register from '../Register/Content';

import ItemProfile from '../../Components/ItemProfile';

//Modals
import NameModal from './Modals/NameModal';
import EmailModal from './Modals/EmailModal';
import PasswordModal from './Modals/PasswordModal';
import Utilities from '../../Config/Utilities';

const options = {
  title: 'Selecciona o toma una imagen',

  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};
export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalAuth: false,
      isLogin: true,
      modalChangeName: false,
      modalChangeEmail: false,
      modalChangePassword: false,
      modalRated: false,
      tycModal: false,
      ayudaModal: false,
      imgSource: '',
      images: [],
      imageUri: null,
    };
  }

  //Shared
  async shareRecipe(type, data) {
    console.log('shareItem:', type, data);
    let shareOptions;
    let title = 'La FemmeApp';
    console.log('title', title);

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
      .then(res => {
        console.log('Share', res);
      })
      .catch(err => {
        err && console.log('Share', err);
      });
  }

  //Rated
  activeReview() {
    const currentUser = auth().currentUser;
    const {uid} = currentUser;
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
    Rate.rate(options, success => {
      if (success) {
        console.log('rate:success', success);
        let name = `activeReview_${Platform.OS}`;
        let properties = {uid: uid};
        console.log('rate', name, properties);
        Alert.alert('Exelente', 'gracias por calificarnos');
      } else {
        console.log('rate:NoSuccess', success);
      }
    });
  }
  //Update image
  pickImage = () => {
    const {setLoading} = this.props;
    setLoading(true);
    ImagePicker.showImagePicker(options, response => {
      if (response.didCancel) {
        console.log('Ups...', 'You cancelled image picker 😟');
        setLoading(false);
      } else if (response.error) {
        Alert.alert('Ups...', 'And error occured: ', response.error);
        setLoading(false);
      } else {
        const source = {uri: response.uri};

        this.setState(
          {
            imgSource: source,
            imageUri: response.uri,
          },
          () => {
            this.uploadImage();
          },
        );
      }
    });
  };
  uploadImage = () => {
    const ext = this.state.imageUri.split('.').pop(); // Extract image extension
    const filename = `${Utilities.create_UUID()}.${ext}`; // Generate unique name
    this.setState({uploading: true});
    this.prepareImage(auth().currentUser.uid, filename);
  };
  async prepareImage(uid, filename) {
    const {setLoading} = this.props;
    let picture = {thumbnail: null, medium: null, large: null};
    let x = this.state.imageUri;
    ImageResizer.createResizedImage(x, 300, 300, 'JPEG', 30, 0)
      .then(RES => {
        console.log('RES 300', RES);
        try {
          firebase
            .storage()
            .ref(`users/${uid}/thumb@${filename}`)
            .putFile(RES.path)
            .on(
              firebase.storage.TaskEvent.STATE_CHANGED,
              snapshot => {
                let state = {};
                state = {
                  ...state,
                  progress:
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100, // Calculate progress percentage
                };
                console.log('snapshot', snapshot);
                if (snapshot.state === firebase.storage.TaskState.SUCCESS) {
                  let allImages = this.state.images;
                  console.log('allImages', allImages);
                  allImages.push(snapshot.downloadURL);
                  state = {
                    ...state,
                    uploading: false,
                    imgSource: '',
                    imageUri: '',
                    progress: 0,
                    images: allImages,
                  };

                  firebase
                    .storage()
                    .ref(`users/${uid}/thumb@${filename}`)
                    .getDownloadURL()
                    .then(url => {
                      console.log('url:_thumb', url);
                      picture = {...picture, thumbnail: url};
                      this.updateUser(picture);
                    });
                }
                this.setState(state);
              },
              error => {
                alert(error, 'Sorry, Try again.');
              },
            );
        } catch (error) {
          console.log('err', error);
          setLoading(false);
        }
      })
      .catch(error => {
        console.log('error', error);
        setLoading(false);
      });

    ImageResizer.createResizedImage(x, 600, 600, 'JPEG', 30, 0)
      .then(RES => {
        console.log('RES 600', RES);
        try {
          firebase
            .storage()
            .ref(`users/${uid}/medium@${filename}`)
            .putFile(RES.path)
            .on(
              firebase.storage.TaskEvent.STATE_CHANGED,
              snapshot => {
                let state = {};
                state = {
                  ...state,
                  progress:
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100, // Calculate progress percentage
                };
                console.log('snapshot', snapshot);
                if (snapshot.state === firebase.storage.TaskState.SUCCESS) {
                  let allImages = this.state.images;

                  allImages.push(snapshot.downloadURL);
                  state = {
                    ...state,
                    uploading: false,
                    imgSource: '',
                    imageUri: '',
                    progress: 0,
                    images: allImages,
                  };

                  firebase
                    .storage()
                    .ref(`users/${uid}/medium@${filename}`)
                    .getDownloadURL()
                    .then(url => {
                      console.log('url:_medium', url);
                      picture = {...picture, medium: url};
                      this.updateUser(picture);
                    });
                }
                this.setState(state);
              },
              error => {
                alert('Sorry, Try again.');
              },
            );
        } catch (error) {
          console.log('err', error);
        }
      })
      .catch(error => {
        console.log('error', error);
      });

    ImageResizer.createResizedImage(x, 1000, 1000, 'JPEG', 30, 0)
      .then(RES => {
        console.log('RES 1000', RES);
        try {
          firebase
            .storage()
            .ref(`users/${uid}/large@${filename}`)
            .putFile(RES.path)
            .on(
              firebase.storage.TaskEvent.STATE_CHANGED,
              snapshot => {
                let state = {};
                state = {
                  ...state,
                  progress:
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100, // Calculate progress percentage
                };
                console.log('snapshot', snapshot);
                if (snapshot.state === firebase.storage.TaskState.SUCCESS) {
                  let allImages = this.state.images;
                  allImages.push(snapshot.downloadURL);
                  state = {
                    ...state,
                    uploading: false,
                    imgSource: '',
                    imageUri: '',
                    progress: 0,
                    images: allImages,
                  };

                  firebase
                    .storage()
                    .ref(`users/${uid}/large@${filename}`)
                    .getDownloadURL()
                    .then(url => {
                      console.log('url:_large', url);
                      picture = {...picture, large: url};
                      this.updateUser(picture);
                    });
                }
                this.setState(state);
              },
              error => {
                alert('Sorry, Try again.');
              },
            );
        } catch (error) {
          console.log('err', error);
        }
      })
      .catch(error => {
        console.log('error', error);
      });
  }

  async updateUser(picture) {
    const {updateProfile, setLoading} = this.props;
    setLoading(true);
    await updateProfile({...picture}, 'picture');
    setLoading(false);
  }

  render() {
    const {
      loading,
      navigation,
      setLoading,
      deviceInfo,
      user,
      setAccount,
      appType,
      logOut,
      setTempRegister,
    } = this.props;
    const {
      isLogin,
      modalAuth,
      modalChangeName,
      modalChangeEmail,
      modalChangePassword,
      modalRated,
      imgSource,
    } = this.state;

    if (!user) {
      return (
        <View style={styles.container}>
          <View style={styles.containerNoUSer}>
            <Text
              style={Fonts.style.semiBold(
                Colors.dark,
                Fonts.size.h6,
                'center',
              )}>
              {'Ups...'}
            </Text>
            <View style={{height: 20}} />
            <Text
              style={Fonts.style.regular(
                Colors.dark,
                Fonts.size.medium,
                'center',
              )}>
              {
                'No logramos identificarte, ingresa o crea una cuenta para ver esta sesión'
              }
            </Text>

            <TouchableOpacity
              onPress={() => {
                this.setState({modalAuth: true});
              }}
              style={[
                styles.btnContainer,
                {
                  backgroundColor:
                    appType === 'client'
                      ? Colors.client.secondaryColor
                      : Colors.expert.secondaryColor,
                },
              ]}>
              <Text
                style={Fonts.style.bold(
                  Colors.light,
                  Fonts.size.medium,
                  'center',
                )}>
                {'Ingresar'}
              </Text>
            </TouchableOpacity>
          </View>

          <Modal //auth
            isVisible={modalAuth && !user}
            onBackdropPress={() => {
              this.setState({modalAuth: false});
            }}
            style={{
              justifyContent: 'flex-end',
              margin: 0,
            }}
            backdropColor={Colors.pinkMask(0.75)}>
            <View
              style={{
                height: Metrics.screenHeight * 0.8,
                justifyContent: 'flex-end',
                margin: 0,
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
                alignItems: 'center',
                backgroundColor: Colors.light,
              }}>
              {isLogin && (
                <Login
                  appType={appType}
                  deviceInfo={deviceInfo}
                  setLoading={val => {
                    setLoading(val);
                  }}
                  setAccount={val => {
                    setAccount(val);
                  }}
                  loading={loading}
                  goBack={() => {
                    this.setState({modalAuth: false});
                    navigation.navigate('Home');
                  }}
                  isLogin={() => this.setState({isLogin: false})}
                />
              )}
              {!isLogin && (
                <Register
                  appType={appType}
                  deviceInfo={deviceInfo}
                  setLoading={val => {
                    setLoading(val);
                  }}
                  setAccount={val => {
                    setAccount(val);
                  }}
                  setTempRegister={data => setTempRegister(data)}
                  loading={loading}
                  goBack={() => {
                    this.setState({modalAuth: false});
                    navigation.navigate('Home');
                  }}
                  isLogin={() => this.setState({isLogin: true})}
                />
              )}
            </View>
          </Modal>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text
            style={Fonts.style.semiBold(Colors.dark, Fonts.size.h6, 'center')}>
            {'Perfil y configuración'}
          </Text>
        </View>

        <ScrollView>
          <View //profile
            style={styles.profileContainer} //profile
          >
            <TouchableOpacity onPress={() => this.pickImage()}>
              {user &&
              user.picture &&
              user.picture.large &&
              user.picture.medium &&
              user.picture.thumbnail ? (
                <Image
                  source={{uri: user.picture.medium}}
                  style={{
                    height: 100,
                    width: 100,
                    borderRadius: 50,
                  }}
                />
              ) : (
                <Image
                  source={Images.user}
                  style={{
                    height: 100,
                    width: 100,
                    borderRadius: 50,
                  }}
                />
              )}
            </TouchableOpacity>

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
                +57 {user.phone}
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
                this.setState({
                  modalChangeName: true,
                });
              }}
              decorationLine={true}
            />
            <ItemProfile
              title={'Actualizar email'}
              icon={'envelope'}
              action={() => {
                this.setState({
                  modalChangeEmail: true,
                });
              }}
              decorationLine={true}
            />
            <ItemProfile
              title={'Actualizar contraseña'}
              icon={'lock'}
              action={() => {
                this.setState({
                  modalChangePassword: true,
                });
              }}
              decorationLine={true}
            />
            <ItemProfile
              title={'Comparte La Femme con tus amigos'}
              icon={'paper-plane'}
              action={() => {
                this.shareRecipe();
              }}
              decorationLine={true}
            />
            <ItemProfile
              title={'Mis direcciones'}
              icon={'map-marker'}
              action={() => {
                console.log('address');
              }}
              decorationLine={false}
            />
          </View>
          {this.state.modalChangeName && (
            <Modal
              isVisible={this.state.modalChangeName}
              style={{
                justifyContent: 'flex-end',
                margin: 0,
              }}
              onBackdropPress={() => {
                this.setState({modalChangeName: false});
              }}
              backdropColor={Colors.pinkMask(0.75)}>
              <View
                style={{
                  paddingTop: 40,
                  height: Metrics.screenHeight * 0.6,
                  justifyContent: 'flex-end',
                  margin: 0,
                  borderTopLeftRadius: 10,
                  borderTopRightRadius: 10,
                  alignItems: 'center',
                  backgroundColor: Colors.light,
                }}>
                <NameModal
                  modalChangeName={this.state.modalChangeName}
                  setLoading={val => {
                    setLoading(val);
                  }}
                  setTempRegister={data => setTempRegister(data)}
                  loading={loading}
                  goBack={() => {
                    this.setState({modalChangeName: false});
                    navigation.navigate('Home');
                  }}
                  user={user}
                />
                <TouchableOpacity
                  onPress={() => {
                    this.setState({modalChangeName: false});
                  }}
                  style={{
                    width: Metrics.screenWidth * 0.5,
                    alignSelf: 'center',
                    borderRadius: Metrics.borderRadius,
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingBottom: ' 10%',
                  }}>
                  <Text
                    style={Fonts.style.regular(
                      Colors.dark,
                      Fonts.size.medium,
                      'center',
                      1,
                    )}>
                    Cancelar
                  </Text>
                </TouchableOpacity>
              </View>
            </Modal>
          )}
          {this.state.modalChangeEmail && (
            <Modal
              isVisible={this.state.modalChangeEmail}
              style={{
                justifyContent: 'flex-end',
                margin: 0,
              }}
              onBackdropPress={() => {
                this.setState({modalChangeEmail: false});
              }}
              backdropColor={Colors.pinkMask(0.75)}>
              <View
                style={{
                  paddingTop: 40,
                  height: Metrics.screenHeight * 0.6,
                  justifyContent: 'flex-end',
                  margin: 0,
                  borderTopLeftRadius: 10,
                  borderTopRightRadius: 10,
                  alignItems: 'center',
                  backgroundColor: Colors.light,
                }}>
                <EmailModal
                  modalChangeName={modalChangeEmail}
                  setLoading={val => {
                    setLoading(val);
                  }}
                  setTempRegister={data => setTempRegister(data)}
                  loading={loading}
                  goBack={() => {
                    this.setState({modalChangeEmail: false});
                    navigation.navigate('Home');
                  }}
                  user={user}
                />
                <TouchableOpacity
                  onPress={() => {
                    console.log('cancelar....');
                    this.setState({modalChangeEmail: false});
                  }}
                  style={{
                    width: Metrics.screenWidth * 0.5,

                    alignSelf: 'center',
                    borderRadius: Metrics.borderRadius,
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingBottom: ' 10%',
                  }}>
                  <Text
                    style={Fonts.style.regular(
                      Colors.dark,
                      Fonts.size.medium,
                      'center',
                      1,
                    )}>
                    Cancelar
                  </Text>
                </TouchableOpacity>
              </View>
            </Modal>
          )}
          {this.state.modalChangePassword && (
            <Modal
              isVisible={this.state.modalChangePassword}
              style={{
                justifyContent: 'flex-end',
                margin: 0,
              }}
              onBackdropPress={() => {
                this.setState({modalChangePassword: false});
              }}
              backdropColor={Colors.pinkMask(0.75)}>
              <View
                style={{
                  paddingTop: 40,
                  height: Metrics.screenHeight * 0.6,
                  justifyContent: 'flex-end',
                  margin: 0,
                  borderTopLeftRadius: 10,
                  borderTopRightRadius: 10,
                  alignItems: 'center',
                  backgroundColor: Colors.light,
                }}>
                <PasswordModal
                  setLoading={val => {
                    setLoading(val);
                  }}
                  setTempRegister={data => setTempRegister(data)}
                  loading={loading}
                  goBack={() => {
                    this.setState({modalChangePassword: false});
                    navigation.navigate('Home');
                  }}
                  user={user}
                />
                <TouchableOpacity
                  onPress={() => {
                    console.log('cancelar....');
                    this.setState({modalChangePassword: false});
                  }}
                  style={{
                    width: Metrics.screenWidth * 0.7,

                    alignSelf: 'center',
                    borderRadius: Metrics.borderRadius,
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingVertical: ' 10%',
                  }}>
                  <Text
                    style={Fonts.style.regular(
                      Colors.dark,
                      Fonts.size.medium,
                      'center',
                      1,
                    )}>
                    Cancelar
                  </Text>
                </TouchableOpacity>
              </View>
            </Modal>
          )}
          <Modal
            isVisible={this.state.tycModal}
            style={{
              justifyContent: 'flex-end',
              margin: 0,
            }}
            onBackdropPress={() => {
              this.setState({tycModal: false});
            }}
            backdropColor={Colors.pinkMask(0.75)}>
            <View
              style={{
                paddingTop: 40,
                height: Metrics.screenHeight * 0.8,
                justifyContent: 'flex-end',
                margin: 0,
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
                alignItems: 'center',
                backgroundColor: Colors.light,
              }}>
              <WebView
                WebView={true}
                source={{uri: 'https://www.weflow.me/terminosycondiciones'}}
                renderLoading={this.renderLoadingView}
                startInLoadingState={true}
                style={{
                  width: Metrics.screenWidth,
                  alignSelf: 'center',
                  flex: 1,
                }}
              />
            </View>
          </Modal>
          <Modal
            isVisible={this.state.ayudaModal}
            style={{
              justifyContent: 'flex-end',
              margin: 0,
            }}
            onBackdropPress={() => {
              this.setState({ayudaModal: false});
            }}
            backdropColor={Colors.pinkMask(0.75)}>
            <View
              style={{
                paddingTop: 40,
                height: Metrics.screenHeight * 0.8,
                justifyContent: 'flex-end',
                margin: 0,
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
                alignItems: 'center',
                backgroundColor: Colors.light,
              }}>
              <WebView
                WebView={true}
                source={{uri: 'https://www.weflow.me/terminosycondiciones'}}
                renderLoading={this.renderLoadingView}
                startInLoadingState={true}
                style={{
                  width: Metrics.screenWidth,
                  alignSelf: 'center',
                  flex: 1,
                }}
              />
            </View>
          </Modal>

          <View //Legals
            style={styles.profileContainer}>
            <ItemProfile
              title={'Califica tu experiencia'}
              icon={'star'}
              action={() => {
                this.activeReview();
              }}
              decorationLine={true}
            />
            <ItemProfile
              title={'Condiciones del servicio'}
              icon={'check-square'}
              action={() => {
                this.setState({tycModal: true});
              }}
              decorationLine={true}
            />

            <ItemProfile
              title={'Ayuda'}
              icon={'question-circle'}
              action={() => {
                this.setState({ayudaModal: true});
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
                logOut();
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
                  `whatsapp://send?text=Me interesa contactar al desarrollador de La Femme &phone=+573106873181`,
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

        {loading && <View style={styles.loading} />}
      </View>
    );
  }
}
