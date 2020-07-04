/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {View, Text, TouchableOpacity, ScrollView, Alert} from 'react-native';
import moment from 'moment';

import _ from 'lodash';
import {Colors, Fonts, Images, Metrics, ApplicationStyles} from '../../Themes';
import ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import {firebase} from '@react-native-firebase/storage';
import styles from './styles';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import ExpertDealOffer from '../../Components/ExpertDealOffer';
import ClientOnExpert from '../ClientOnExpert';
import {setLoading} from '../../Core/UI/Actions';
import ServiceItemBanner from '../../Components/ServiceItemBanner';

import Utilities from '../../Config/Utilities';

const options = {
  title: 'Selecciona o toma una imagen',

  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};
export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {imgSource: '', images: [], imageUri: null};
  }

  async componentDidMount() {
    const {
      getExpertOpenOrders,
      getExpertActiveOrders,
      getExpertHistoryOrders,
      setLoading,
    } = this.props;

    await getExpertOpenOrders();
    await getExpertHistoryOrders();
    await getExpertActiveOrders();
    setLoading(false);
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
            .ref(`experts/${uid}/pics@${filename}`)
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
                    .ref(`experts/${uid}/pics@${filename}`)
                    .getDownloadURL()
                    .then(url => {
                      console.log('url:_thumb', url);
                      picture = {...picture, thumbnail: url};
                      console.log('===>picture', picture);
                      console.log('===>url', url);
                      this.updateGallery(picture);
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
            .ref(`experts/${uid}/pics@${filename}`)
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
                    .ref(`experts/${uid}/pics@${filename}`)
                    .getDownloadURL()
                    .then(url => {
                      console.log('url:_medium', url);
                      picture = {...picture, medium: url};
                      console.log('===>picture', picture);
                      console.log('===>url', url);
                      this.updateGallery(picture);
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
            .ref(`experts/${uid}/pics@${filename}`)
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
                    .ref(`experts/${uid}/pics@${filename}`)
                    .getDownloadURL()
                    .then(url => {
                      console.log('url:_large', url);
                      picture = {...picture, large: url};
                      console.log('===>picture', picture);
                      console.log('===>url', url);
                      this.updateGallery(picture);
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

  async updateGallery(picture) {
    const {setLoading} = this.props;
    const currentUser = auth().currentUser;
    const filename = Utilities.create_UUID(); // Generate unique name
    setLoading(true);

    try {
      await firestore()
        .collection('gallery')
        .doc(filename)
        .set({
          expertImage: currentUser.photoURL,
          imageUrl: picture.large,
          date: moment(new Date()).format(),
          expertName: `${this.props.user.firstName}  ${
            this.props.user.lastName
          }`,
        });
      Alert.alert('Que bien...', 'Se subio correctamente');
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      Alert.alert('Ups...', 'Algo salio mal');
    }
  }

  render() {
    const {
      logOut,
      user,
      appType,
      loading,
      expertOpenOrders,
      expertActiveOrders,
      assignExpert,
    } = this.props;
    const {} = this.state;

    if (user && user.roles.indexOf('expert') === -1) {
      return <ClientOnExpert />;
    }

    if (!user) {
      return null;
    } else {
      return (
        <View style={styles.container}>
          <TouchableOpacity onPress={() => this.pickImage()}>
            <Text>Subir tu trabajo</Text>
          </TouchableOpacity>

          {expertActiveOrders.length > 0 ? (
            <ServiceItemBanner
              item={expertActiveOrders[0]}
              appType={appType}
              onPress={() => {}}
            />
          ) : (
            <View style={{marginTop: Metrics.addHeader}} />
          )}
          {expertOpenOrders.length > 0 ? (
            <ScrollView
              style={[ApplicationStyles.scrollHomeExpert, {flex: 1}]}
              bounces={true}>
              {/* <View style={{height: Metrics.addHeader}}></View> */}
              {expertOpenOrders.map((item, index) => {
                console.log(item);
                return (
                  <View key={item.id}>
                    <ExpertDealOffer
                      order={item}
                      user={user}
                      onSwipe={() => {
                        console.log('ExpertDealOffer:home');
                        setLoading(true);
                        let expertData = {
                          coordinates: {
                            latitude: 6.2458007,
                            longitude: -75.5680003,
                          },
                          id: user.id,
                          ranking: user.ranking,
                          lastName: user.lastName,
                          firstName: user.firstName,
                          image: user.pics.image,
                          thumbnail: user.pics.thumbnail,
                        };

                        assignExpert(item.id, index, expertData);
                      }}
                    />
                  </View>
                );
              })}
            </ScrollView>
          ) : (
            <View
              style={{
                flex: 1,
                paddingHorizontal: 30,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={Fonts.style.semiBold(
                  Colors.dark,
                  Fonts.size.h6,
                  'center',
                )}>
                {'No hay ordenes actualmente'}
              </Text>
              <Text
                style={Fonts.style.regular(
                  Colors.dark,
                  Fonts.size.medium,
                  'center',
                )}>
                {
                  'Este pendiente de las notificaciones que te avisaremos cuando tengamos nuevos clientes'
                }
              </Text>
            </View>
          )}
        </View>
      );
    }
  }
}
