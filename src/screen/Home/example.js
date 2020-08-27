import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Keyboard,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';

import moment from 'moment';
import LinearGradient from 'react-native-linear-gradient';
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
import Icon from 'react-native-vector-icons/FontAwesome5';
import AutoHeightImage from 'react-native-auto-height-image';
import Header from '../../Components/Header';
import CartFooter from '../../Components/CartFooter';
import GalleryItem from '../../Components/GalleryItem';
import ExpandHome from '../../Components/ExpandHome';
import BannerScroll from '../../Components/BannerScroll';

import Login from '../../Screens/Login';
import Cart from '../../Screens/Cart';
import Orders from '../../Screens/Orders';
import Address from '../../Screens/Address';
import AddAddress from '../../Screens/AddAddress';
import Register from '../../Screens/Register';

import StarRating from 'react-native-star-rating';
import Modal from 'react-native-modal';
import auth from '@react-native-firebase/auth';

import messaging from '@react-native-firebase/messaging';

import FastImage from 'react-native-fast-image';
import Loading from '../../Components/Loading';
import {green} from 'ansi-colors';
import {formatDate} from '../../Helpers/MomentHelper';
import AppConfig from '../../Config/AppConfig';
import ServiceItemBanner from '../../Components/ServiceItemBanner';

const TIME_SET = 500;

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userLocation: '',
      showFinder: false,
      lat: '',
      long: '',
      openModal: false,
      modalAuth: false,
      modalAddress: false,
      isModalCart: false,
      modalOrders: false,
      modalAddAddress: false,
      modalCart: false,
      isLogin: true,
      user: null,
    };
    this.unsubscriber = null;
  }

  // async componentWillMount() {
  //   const {getDeviceInfo} = this.props;

  //   await getDeviceInfo();
  // }
  async componentDidMount() {
    const {
      getServices,
      getOrders,
      getDeviceInfo,
      getCoverage,
      setAuth,
      setAccount,
      setLoading,
      getGallery,
      user,
      logOut,
    } = this.props;
    // await logOut();
    setLoading(true);
    await getDeviceInfo();
    await getGallery();
    await getCoverage('Medellín');

    // Notifications Module
    console.log('startMessaging');
    messaging()
      .hasPermission()
      .then((enabled) => {
        console.log('push permissions');
        if (enabled) {
          console.log('hasPermission', enabled);

          messaging()
            .getToken()
            .then((token) => {
              if (token) {
                console.log('token', token);
                this.setFCM(token);
              } else {
                console.log('token failed');
              }
            });
          // user has permissions
        } else {
          // user doesn't have permission
          console.log('user does not have permission');

          // messaging()
          //   .requestPermission()
          //   .then(() => {
          //     // User has authorised
          //     console.log('User has authorised');
          //   })
          //   .catch(error => {
          //     // User has rejected permissions
          //     console.log('User has rejected permissions', error);
          //   });
        }
      });

    this.messageListener = messaging().onMessage((message) => {
      // Process your message as required
      console.log('Process your message as required: message', message);
      // Alert.alert(message.data.title, message.data.body);
    });

    // await this._checkPermission();
    //END Notifications Module

    console.log('deviceInfo', this.props);
    this.unsubscriber = await auth().onAuthStateChanged((user) => {
      console.log('onAuthStateChanged', user);
      if (user) {
        setAuth(user);

        if (auth().currentUser && auth().currentUser.uid && user == null) {
          this.callSetUser(auth().currentUser.uid);
        }

        if (auth().currentUser && auth().currentUser.uid) {
          // console.log(auth().currentUser);
          setAccount(auth().currentUser.uid);
        }
      }
    });

    await getServices();
    if (user) {
      await getOrders();
    }
    setLoading(false);
  }

  async setFCM(token) {
    const {user, updateProfile} = this.props;

    console.log('setFCM:token', token);
    // await updateProfile(address, 'address');
    await updateProfile({...user.tokens, fcm: token}, 'tokens');
  }
  async callSetUser(uid) {
    const {setAccount} = this.props;

    await setAccount(uid);
  }
  componentWillUnmount() {
    if (this.unsubscriber) {
      this.unsubscriber();
    }
  }

  setL() {
    const {loading, setLoading} = this.props;

    setLoading(!loading);
  }

  actionR() {
    console.log('actionR');
    this.setL();
  }
  selectAddress() {
    console.log('selectAddress');
    this.setState({modalAddress: true});
  }
  selectService(product) {
    const {navigation, user} = this.props;
    console.log('selectService', product);
    // StatusBar.setBarStyle('dark-content', false);

    if (user !== null) {
      if (user && user.cart && user.cart.address) {
        navigation.navigate('ProductDetail', {product});
      } else {
        this.setState({modalAddress: true});
      }
    } else {
      this.setState({modalAuth: true});
    }
  }

  selectBanner() {
    const {openModal} = this.state;
    console.log('selectBanner');
    this.setState({openModal: true});
  }

  render() {
    const {
      services,
      gallery,
      user,
      orders,
      deviceInfo,

      modalOrders,
      appType,
      loading,
    } = this.props;
    const {
      openModal,
      modalAuth,
      modalCart,
      modalAddress,
      modalAddAddress,
      isLogin,
    } = this.state;

    return (
      <View style={styles.container}>
        <Header
          appType={appType}
          title={'Agrega una dirección'}
          iconL={null}
          iconR={null}
          user={user}
          ordersActive={orders.length}
          selectAddress={() => {
            console.log('selectAddress');
            this.selectAddress();
          }}
          onActionL={() => {}}
          onActionR={() => {}}
        />

        <ScrollView
          style={[ApplicationStyles.scrollHome, {marginTop: Metrics.header}]}
          bounces={true}>
          {orders.length > 0 ? (
            <ServiceItemBanner
              item={orders[0]}
              appType={appType}
              onPress={() => {
                this.setState({modalOrders: true}, () => {
                  console.log('modalOrders', this.state.modalOrders);
                });
              }}
            />
          ) : (
            <View style={{marginTop: Metrics.addHeader}} />
          )}
          {services.map((data) => {
            return (
              <ExpandHome
                key={data.id}
                data={data}
                image={{uri: data.imageUrl}}
                selectService={(product) => this.selectService(product)}
              />
            );
          })}
          {services && (
            <BannerScroll
              key={'banner'}
              name={'INSPO'}
              subtitle={'Busca inspiración para tu próxima cita'}
              image={Images.banner}
              selectBanner={() => this.selectBanner()}
            />
          )}
          <View style={{height: 50}} />
        </ScrollView>

        {user && user.cart && (
          <View
            style={{
              width: Metrics.screenWidth,
              height: 50,
              bottom: 0,
              backgroundColor: 'transparet',
              position: 'absolute',
              // marginBottom: 0,
            }}>
            <CartFooter
              key={'CartFooter'}
              title={'Completar orden'}
              servicesNumber={
                user && user.cart && user.cart.services
                  ? user.cart.services.length
                  : 0
              }
              servicesTotal={
                user &&
                user.cart &&
                user.cart.services &&
                user.cart.services.length > 0
                  ? _.sumBy(user.cart.services, 'total')
                  : 0
              }
              onAction={() => this.setState({modalCart: true})}
            />
          </View>
        )}

        <Modal // Cart
          isVisible={modalCart}
          animationInTiming={500}
          animationOutTiming={500}
          style={{
            justifyContent: 'flex-end',
            margin: 0,
          }}
          backdropColor={Colors.pinkMask(0.8)}
          onBackdropPress={() => {
            this.setState({modalCart: false});
          }}>
          <>
            <TouchableOpacity
              style={{
                alignSelf: 'center',
                justifyContent: 'center',
                alignItems: 'center',
                width: 30,
                marginVertical: 8,
                backgroundColor: Colors.light,
                height: 4,
                borderRadius: 2.5,
              }}
              onPress={() => {
                this.setState({modalCart: false});
              }}
            />
            <View
              style={{
                // paddingTop: Metrics.addHeader,
                alignSelf: 'center',
                width: Metrics.screenWidth,
                height: Metrics.screenHeight * 0.85,
                backgroundColor: Colors.light,

                borderTopRightRadius: 10,
                borderTopLeftRadius: 10,
              }}>
              <Cart
                key={'cartHome'}
                closeModal={() => {
                  this.setState({modalCart: false});
                }}
                modalAddress={() => {
                  const that = this;
                  this.setState({modalCart: false, isModalCart: true}, () => {
                    setTimeout(function () {
                      that.setState({modalAddress: true});
                    }, TIME_SET);
                  });
                }}
              />
            </View>

            <Loading type={'client'} loading={loading} />
          </>
        </Modal>

        <Modal // address
          isVisible={modalAddress}
          style={{
            justifyContent: 'flex-end',
            margin: 0,
          }}
          animationIn={'slideInRight'}
          animationOut={'slideOutRight'}
          backdropColor={Colors.pinkMask(0.8)}
          onBackdropPress={() => {
            const that = this;
            this.setState({modalAddress: false}, () => {
              if (this.state.isModalCart) {
                setTimeout(function () {
                  that.setState({modalCart: true});
                }, TIME_SET);
              }
            });
          }}>
          <>
            <TouchableOpacity
              style={{
                alignSelf: 'center',
                justifyContent: 'center',
                alignItems: 'center',
                width: 30,
                marginVertical: 8,
                backgroundColor: Colors.light,
                height: 4,
                borderRadius: 2.5,
              }}
              onPress={() => {
                this.setState({modalAddress: false});
              }}
            />
            <View
              style={{
                // paddingTop: Metrics.addHeader,
                alignSelf: 'center',
                width: Metrics.screenWidth,
                height: Metrics.screenHeight * 0.85,
                backgroundColor: Colors.light,
                backdropColor: 'red',
                borderTopRightRadius: 10,
                borderTopLeftRadius: 10,
              }}>
              <Address
                addAddress={() => {
                  this.setState({
                    isModalCart: false,
                    modalAddAddress: true,
                  });
                }}
                closeModal={() => {
                  const that = this;
                  this.setState({
                    modalAddress: false,
                  });

                  if (this.state.isModalCart) {
                    setTimeout(function () {
                      that.setState({modalCart: true});
                    }, TIME_SET);
                  }
                }}
              />
            </View>

            <Loading type={'client'} loading={loading} />

            <Modal // modalAddAddress
              isVisible={modalAddAddress}
              style={{
                justifyContent: 'flex-end',
                margin: 0,
              }}
              animationIn={'slideInRight'}
              animationOut={'slideOutRight'}
              backdropColor={Colors.pinkMask(0.8)}
              onBackdropPress={() => {
                this.setState({modalAddAddress: false});
              }}>
              <>
                <TouchableOpacity
                  style={{
                    alignSelf: 'center',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 30,
                    marginVertical: 8,
                    backgroundColor: Colors.light,
                    height: 4,
                    borderRadius: 2.5,
                  }}
                  onPress={() => {
                    this.setState({modalAddress: false});
                  }}
                />
                <View
                  style={{
                    // paddingTop: Metrics.addHeader,
                    alignSelf: 'center',
                    width: Metrics.screenWidth,
                    height: Metrics.screenHeight * 0.85,
                    backgroundColor: Colors.light,
                    backdropColor: 'red',
                    borderTopRightRadius: 10,
                    borderTopLeftRadius: 10,
                  }}>
                  <AddAddress
                    addAddress={() => {
                      this.setState({
                        modalAddAddress: true,
                      });
                    }}
                    closeAddAddress={() => {
                      this.setState({
                        modalAddAddress: false,
                      });
                    }}
                  />
                </View>
              </>
            </Modal>
          </>
        </Modal>

        <Modal // orders
          isVisible={this.state.modalOrders}
          animationInTiming={500}
          animationOutTiming={500}
          style={{
            justifyContent: 'flex-end',
            margin: 0,
          }}
          backdropColor={Colors.pinkMask(0.8)}
          onBackdropPress={() => {
            this.setState({modalOrders: false});
          }}>
          <>
            <TouchableOpacity
              style={{
                alignSelf: 'center',
                justifyContent: 'center',
                alignItems: 'center',
                width: 30,
                marginVertical: 8,
                backgroundColor: Colors.light,
                height: 4,
                borderRadius: 2.5,
              }}
              onPress={() => {
                this.setState({modalOrders: false});
              }}
            />
            <View
              style={{
                // paddingTop: Metrics.addHeader,
                alignSelf: 'center',
                width: Metrics.screenWidth,
                height: Metrics.screenHeight * 0.85,
                backgroundColor: Colors.light,

                borderTopRightRadius: 10,
                borderTopLeftRadius: 10,
              }}>
              <Orders
                key={'orders'}
                closeModal={() => {
                  this.setState({modalOrders: false});
                }}
              />
            </View>

            <Loading type={'client'} loading={loading} />
          </>
        </Modal>

        <Modal //gallery
          isVisible={openModal}
          style={{
            justifyContent: 'flex-end',
            margin: 0,
          }}
          backdropColor={Colors.pinkMask(0.8)}
          onBackdropPress={() => {
            this.setState({openModal: false});
          }}>
          <View
            style={{
              width: Metrics.screenWidth,
              height: Metrics.screenHeight * 0.85,
              backgroundColor: Colors.light,
              borderTopRightRadius: 10,
              borderTopLeftRadius: 10,
            }}>
            <TouchableOpacity
              style={{
                alignSelf: 'center',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => {
                this.setState({openModal: false});
              }}>
              <Text>─</Text>
            </TouchableOpacity>

            <ScrollView
              style={{
                flex: 1,
                width: Metrics.screenWidth,
              }}>
              <View
                style={{
                  width: Metrics.screenWidth,
                  flexDirection: 'row',
                }}>
                <View
                  style={{
                    flex: 1,
                    width: Metrics.screenWidth / 2,
                    marginBottom: Metrics.addFooter + 20,
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                  }}>
                  {openModal &&
                    gallery.map((item, index) => {
                      return (
                        <GalleryItem key={index} index={index} item={item} />
                      );
                    })}
                </View>
              </View>
            </ScrollView>
          </View>
        </Modal>

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
              // flex: 0,
              height: Metrics.screenHeight * 0.8,
              justifyContent: 'flex-end',
              margin: 0,
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
              alignItems: 'center',
              backgroundColor: Colors.light,
            }}>
            {isLogin && (
              <Login isLogin={() => this.setState({isLogin: false})} />
            )}
            {!isLogin && (
              <Register isLogin={() => this.setState({isLogin: true})} />
            )}
          </View>
        </Modal>
      </View>
    );
  }
}
