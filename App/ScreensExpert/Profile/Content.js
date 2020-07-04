/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  TouchableOpacity,
  Keyboard,
} from 'react-native';

import _ from 'lodash';

import {
  Colors,
  Fonts,
  Images,
  Metrics,
  ApplicationStyles,
  FlatList,
} from '../../Themes';

import styles from './styles';
import {getExpertHistoryOrders} from '../../Core/Services/Actions';
import MyTextInput from '../../Components/MyTextInput';
import moment from 'moment';
import DatePicker from 'react-native-datepicker';
import ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import auth from '@react-native-firebase/auth';
import {firebase} from '@react-native-firebase/storage';
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
      email: '',
      firstName: '',
      lastName: '',
      phone: '',
      birthday: '',

      imgSource: '',
      images: [],
      imageUri: null,
    };
  }

  async updateProfile() {
    const {auth, user, updateProfile, navigation} = this.props;
    console.log('updateProfile');
    const {
      email,
      firstName,
      lastName,
      birthday,
      selectedPleasures,
      gender,
      genderFilter,
      relationStatus,
      phone,
    } = this.state;

    if (
      email !== '' &&
      firstName !== '' &&
      lastName !== '' &&
      birthday != null &&
      relationStatus != null &&
      selectedPleasures.length > 0 &&
      phone !== ''
    ) {
      const data = {
        uid: auth.uid,
        email,
        firstName,
        lastName,
        birthday,
        phone,
      };

      console.log('updateProfile:data', data);

      try {
        console.log('try');
        await updateProfile({...user.profile, ...data}, 'profile');
        // navigation.navigate('Home');
      } catch (error) {
        console.log('error', error);
      }
    } else {
      Alert.alert('Ups...', 'Completa todos los datos para continuar.');
    }
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
    constcurrentUser = auth().currentUser;
    setLoading(true);
    await updateProfile({...picture}, 'picture');
    setLoading(false);
  }

  render() {
    const {user} = this.props;

    const {email, firstName, lastName, birthday, phone} = this.state;

    return (
      <View style={styles.container}>
        <View style={{marginTop: 30 + Metrics.addHeader, paddingBottom: 20}}>
          <View style={styles.headerContainer}>
            <Text
              style={Fonts.style.semiBold(
                Colors.dark,
                Fonts.size.h6,
                'center',
              )}>
              {'Completa tu perfil'}
            </Text>
          </View>
          <ScrollView>
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              {user &&
              user.picture &&
              user.picture.large &&
              user.picture.medium &&
              user.picture.thumbnail ? (
                <View style={{marginVertical: 10}}>
                  <Image
                    source={{uri: user.picture.medium}}
                    style={{
                      height: 100,
                      width: 100,
                      borderRadius: 50,
                    }}
                  />
                </View>
              ) : (
                <TouchableOpacity onPress={() => this.pickImage()}>
                  <Image
                    source={Images.user}
                    style={{
                      height: 100,
                      width: 100,
                      borderRadius: 50,
                    }}
                  />
                </TouchableOpacity>
              )}
            </View>

            <View style={{width: '100%', marginTop: 20}}>
              <Text
                style={[
                  Fonts.style.regular(Colors.Gray, Fonts.size.tiny, 'left'),
                ]}>
                {' Correo electrónico'}
              </Text>
              <MyTextInput
                pHolder={'Correo electrónico'}
                text={email}
                editable={this.props.auth.email !== null}
                onChangeText={text => this.setState({email: text})}
                secureText={false}
                textContent={'emailAddress'}
                autoCapitalize={'none'}
              />
            </View>
            <View style={{width: '100%'}}>
              <Text
                style={[
                  Fonts.style.regular(Colors.Gray, Fonts.size.tiny, 'left'),
                ]}>
                {' Nombre'}
              </Text>
              <MyTextInput
                pHolder={'Nombre'}
                text={firstName}
                onChangeText={text => this.setState({firstName: text})}
                secureText={false}
                textContent={'name'}
                autoCapitalize={'words'}
              />
            </View>
            <View style={{width: '100%'}}>
              <Text
                style={[
                  Fonts.style.regular(Colors.Gray, Fonts.size.tiny, 'left'),
                ]}>
                {' Apellido'}
              </Text>
              <MyTextInput
                pHolder={'Apellido'}
                text={lastName}
                onChangeText={text => this.setState({lastName: text})}
                secureText={false}
                textContent={'name'}
                autoCapitalize={'words'}
              />
            </View>
            <View style={{width: '100%'}}>
              <Text
                style={[
                  Fonts.style.regular(Colors.Gray, Fonts.size.tiny, 'left'),
                ]}>
                {' Telefono'}
              </Text>
              <MyTextInput
                pHolder={'Telefono (Obligatorio)'}
                text={phone}
                keyboardType={'phone-pad'}
                onChangeText={text => this.setState({phone: text})}
                secureText={false}
                textContent={'phone'}
                autoCapitalize={'words'}
              />
            </View>
            <View style={{width: '100%'}}>
              <Text
                style={[
                  Fonts.style.regular(Colors.Gray, Fonts.size.tiny, 'left'),
                ]}>
                {' Fecha de nacimiento'}
              </Text>

              <MyTextInput
                pHolder={'Fecha de nacimiento'}
                text={birthday}
                onChangeText={text => this.setState({birthday: text})}
                secureText={false}
                editable={false}
              />

              <DatePicker
                style={{
                  width: Metrics.screenWidth * 0.8,
                  position: 'absolute',
                  backgroundColor: 'transparent',
                }}
                date={birthday}
                mode={'date'}
                placeholder={'Fecha de nacimiento'}
                placeholderTextColor={Colors.Gray}
                format={'YYYY-MM-DD'}
                maxDate={moment(new Date()).format('YYYY-MM-DD')}
                confirmBtnText={'Confirmar'}
                cancelBtnText={'Cancelar'}
                showIcon={false}
                customStyles={{
                  dateIcon: {
                    position: 'absolute',
                    left: 0,
                    width: 0,
                    height: 0,
                    marginLeft: 0,
                  },
                  placeholderText: {
                    fontFamily: Fonts.type.regular,

                    color: 'transparent',
                    fontSize: Fonts.size.TextInput,
                    textAlignVertical: 'center',
                    textAlign: 'left',
                  },
                  _dateText: {
                    color: 'red',
                  },
                  dateInput: {
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    borderColor: 'transparent',
                    height: 40,
                    width: Metrics.screenWidth * 0.8,
                    flex: 1,
                    color: 'transparent',
                  },
                  dateText: {
                    fontFamily: Fonts.type.regular,
                    // color: Colors.OruxDark,
                    // height: 38,
                    fontSize: Fonts.size.TextInput,
                    textAlignVertical: 'center',
                    textAlign: 'left',
                    color: 'transparent',
                  },
                }}
                onDateChange={date => {
                  this.setState({birthday: date});
                }}
              />
            </View>
            <View style={{width: '100%'}} />
            <View style={{marginVertical: 10}}>
              <TouchableOpacity
                onPress={() => {
                  Keyboard.dismiss();
                  this.updateProfile();
                }}
                style={[
                  styles.btnContainer,

                  {
                    backgroundColor: Colors.expert.secondaryColor,
                    marginVertical: 20,
                  },
                ]}>
                <Text
                  style={Fonts.style.bold(
                    Colors.light,
                    Fonts.size.medium,
                    'center',
                  )}>
                  {'Completar perfil'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  this.props.logOut();
                  this.props.navigation.navigate('Loading');
                }}>
                <Text
                  style={Fonts.style.bold(
                    Colors.dark,
                    Fonts.size.medium,
                    'center',
                  )}>
                  {'Cerrar sesion'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    );
  }
}
