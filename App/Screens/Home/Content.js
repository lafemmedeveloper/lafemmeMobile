/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Keyboard,
  ScrollView,
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

import FastImage from 'react-native-fast-image';
import Loading from '../../Components/Loading';
import {green} from 'ansi-colors';
import {formatDate} from '../../Helpers/MomentHelper';
import AppConfig from '../../Config/AppConfig';

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
      modalOrders: false,
      modalAddAddress: false,
      modalCart: false,
      isLogin: true,
      user: null,
    };
    this.unsubscriber = null;
  }

  async componentDidMount() {
    const {
      getServices,
      getOrders,
      getDeviceInfo,
      setAuth,
      setAccount,
      setLoading,
      user,
    } = this.props;

    setLoading(true);
    // await getDeviceInfo();

    this.unsubscriber = await auth().onAuthStateChanged(user => {
      if (user) {
        setAuth(user);

        if (auth().currentUser && auth().currentUser.uid && user == null) {
          this.callSetUser(auth().currentUser.uid);
        }
      }
    });

    if (auth().currentUser && auth().currentUser.uid) {
      // console.log(auth().currentUser);
      await setAccount(auth().currentUser.uid);
    }

    await getServices();
    if (user) {
      await getOrders();
    }
    setLoading(false);
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

  logout() {}

  actionL() {
    console.log('actionL');
  }

  actionR() {
    console.log('actionR');
    this.setL();
  }
  selectAddress() {
    console.log('selectAddress');
  }
  selectService(product) {
    const {navigation, user} = this.props;
    console.log('selectService', product);
    // StatusBar.setBarStyle('dark-content', false);

    if (user !== null) {
      navigation.navigate('ProductDetail', {product});
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
      imgs,
      user,
      orders,
      deviceInfo,
      logOut,
      modalOrders,
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
          title={'Agrega una dirección'}
          iconL={Images.menu}
          iconR={null}
          user={user}
          ordersActive={orders.length}
          selectAddress={() => this.selectAddress()}
          onActionL={() => this.actionL()}
          onActionR={() => {}}
        />

        <ScrollView style={ApplicationStyles.scrollHome} bounces={true}>
          {orders.length > 0 ? (
            <TouchableOpacity
              onPress={() => {
                this.setState({modalOrders: true}, () => {
                  console.log('modalOrders', this.state.modalOrders);
                });
              }}>
              <LinearGradient
                style={[
                  ApplicationStyles.bannerOrders,
                  ApplicationStyles.shadownClient,
                ]}
                colors={[
                  Colors.client.primartColor,
                  Colors.client.secondaryColor,
                ]}
                start={{x: 0, y: 1}}
                end={{x: 1, y: 0}}>
                <View
                  style={{
                    flex: 1,
                    marginHorizontal: 15,
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={Fonts.style.bold(
                      Colors.light,
                      Fonts.size.small,
                      'left',
                    )}>
                    Mi Proximo Servicio:
                  </Text>
                  <Text
                    style={Fonts.style.regular(
                      Colors.light,
                      Fonts.size.small,
                      'left',
                    )}>
                    <Icon
                      name={'map-marker-alt'}
                      size={12}
                      color={Colors.light}
                    />{' '}
                    {orders[0].address.name}
                  </Text>
                  <Text
                    style={Fonts.style.regular(
                      Colors.light,
                      Fonts.size.small,
                      'left',
                    )}>
                    <Icon name={'calendar'} size={12} color={Colors.light} />{' '}
                    {formatDate(orders[0].day, 'ddd, LL')}
                  </Text>
                  <Text
                    style={Fonts.style.regular(
                      Colors.light,
                      Fonts.size.small,
                      'left',
                    )}>
                    <Icon name={'clock'} size={12} color={Colors.light} />{' '}
                    {formatDate(moment(orders[0].hour, 'HH:mm'), 'h:mm a')}
                  </Text>
                </View>
                <View
                  style={{
                    // flex: 0,
                    width: 140,

                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Image
                    source={Images.moto}
                    style={{
                      height: 55,
                      width: 140,
                      resizeMode: 'contain',
                    }}
                  />
                  <View
                    style={{
                      backgroundColor: Colors.status[orders[0].status],
                      marginTop: 5,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: 10,
                      paddingHorizontal: 10,
                    }}>
                    <Text
                      numberOfLines={1}
                      style={Fonts.style.bold(
                        Colors.light,
                        Fonts.size.tiny,
                        'left',
                      )}>
                      {AppConfig.orderStatusStr[orders[0].status]}
                    </Text>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            <View style={{marginTop: 60 + Metrics.addHeader + 10}}></View>
          )}
          {services.map(data => {
            return (
              <ExpandHome
                key={data.id}
                data={data}
                image={{uri: data.imageUrl}}
                selectService={product => this.selectService(product)}
              />
            );
          })}
          {services && (
            <BannerScroll
              key={'banner'}
              name={'Galería'}
              image={Images.banner}
              selectBanner={() => this.selectBanner()}
            />
          )}
          {user && (
            <Text
              style={Fonts.style.regular(
                Colors.dark,
                Fonts.size.small,
                'center',
              )}>
              {'email:'} {user.email}
            </Text>
          )}

          <TouchableOpacity
            onPress={() => {
              console.log('signOut');
              auth().signOut;
              logOut();
            }}>
            <Text
              style={Fonts.style.regular(
                Colors.dark,
                Fonts.size.small,
                'center',
              )}>
              {'LOGOUT'}
            </Text>
          </TouchableOpacity>
          <Text
            style={Fonts.style.regular(
              Colors.dark,
              Fonts.size.small,
              'center',
            )}>
            {'bundleId:'} {deviceInfo.readableVersion}
          </Text>
          <View style={{height: 70}}></View>
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
              title={'Servicios'}
              servicesNumber={user.cart.services.length}
              servicesTotal={
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
                  this.setState({modalAddress: true});
                }}
              />
            </View>

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
                this.setState({modalAddress: false});
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
                        modalAddAddress: true,
                      });
                    }}
                    closeModal={() => {
                      this.setState({
                        modalAddress: false,
                      });
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

            <Loading type={'client'} loading={loading} />
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
              // flex: 1,
              // paddingTop: Metrics.addHeader,
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
                // height:'100%',
                // backgroundColor: 'blue'
                // flexDirection: 'row'
                // flexWrap: 'wrap'
              }}>
              <View
                style={{
                  width: Metrics.screenWidth,
                  // height:'100%',
                  // backgroundColor: 'blue',
                  flexDirection: 'row',
                  // flexWrap: 'wrap'
                }}>
                <View
                  style={{
                    flex: 1,
                    width: Metrics.screenWidth / 2,
                    // height:'100%',
                    // backgroundColor: 'green',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                  }}>
                  {openModal &&
                    imgs.map((item, index) => {
                      if (index % 2 != 0) {
                        return null;
                      }
                      return (
                        <GalleryItem key={index} index={index} item={item} />
                      );
                    })}
                </View>
                <View
                  style={{
                    flex: 1,
                    width: Metrics.screenWidth / 2,
                    // height:'100%',
                    // backgroundColor: 'green',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                  }}>
                  {openModal &&
                    imgs.map((item, index) => {
                      if (index % 2 == 0) {
                        return null;
                      }
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
          isVisible={modalAuth}
          onBackdropPress={() => {
            this.setState({modalAuth: false});
          }}
          // isVisible={user.uid == null}
          style={{
            justifyContent: 'flex-end',
            margin: 0,

            // ,height: Metrics.screenHeight * 0.7
            // top:100,
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
