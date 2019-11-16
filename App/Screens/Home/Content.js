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

import AutoHeightImage from 'react-native-auto-height-image';
import Header from '../../Components/Header';
import CartFooter from '../../Components/CartFooter';
import GalleryItem from '../../Components/GalleryItem';
import ExpandHome from '../../Components/ExpandHome';
import BannerScroll from '../../Components/BannerScroll';

import Login from '../../Screens/Login';
import Cart from '../../Screens/Cart';
import Address from '../../Screens/Address';
import Register from '../../Screens/Register';

import StarRating from 'react-native-star-rating';
import Modal from 'react-native-modal';
import auth from '@react-native-firebase/auth';

import FastImage from 'react-native-fast-image';
import Loading from '../../Components/Loading';

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
      modalCart: false,
      isLogin: true,
      user: null,
    };
    this.unsubscriber = null;
  }

  async componentDidMount() {
    const {
      getServices,
      getDeviceInfo,
      setAuth,
      setAccount,
      setLoading,
    } = this.props;

    setLoading(true);
    await getDeviceInfo();

    this.unsubscriber = await auth().onAuthStateChanged(user => {
      if (user) {
        setAuth(user);

        if (auth().currentUser && auth().currentUser.uid && user == null) {
          this.callSetUser(auth().currentUser.uid);
        }
      }
    });

    if (auth().currentUser && auth().currentUser.uid) {
      console.log(auth().currentUser);
      await setAccount(auth().currentUser.uid);
    }

    await getServices();

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
    const {services, imgs, user, deviceInfo, logOut, loading} = this.props;
    const {openModal, modalAuth, modalCart, modalAddress, isLogin} = this.state;

    return (
      <View style={styles.container}>
        <Header
          title={'Inicio'}
          iconL={Images.menu}
          iconR={Images.alarm}
          user={user}
          selectAddress={() => this.selectAddress()}
          onActionL={() => this.actionL()}
          onActionR={() => this.actionR()}
        />
        <ScrollView style={ApplicationStyles.scrollHome} bounces={false}>
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
          {/* <Text
          style={Fonts.style.regular(Colors.dark, Fonts.size.small, 'center')}>
          {'Home View'}
        </Text>
        <Text
          style={Fonts.style.regular(Colors.dark, Fonts.size.small, 'center')}>
          {' name:'} {user.fullName}
        </Text>
        <Text
          style={Fonts.style.regular(Colors.dark, Fonts.size.small, 'center')}>
          {'email:'} {user.email}
        </Text>
        <Text
          style={Fonts.style.regular(Colors.dark, Fonts.size.small, 'center')}>
          {'bundleId:'} {deviceInfo.bundleId}
        </Text>
        <Text
          style={Fonts.style.regular(Colors.dark, Fonts.size.small, 'center')}>
          {'V:'}
          {deviceInfo.readableVersion}
        </Text> */}
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

          <View style={{height: 20}}></View>
        </ScrollView>

        {user && user.cart && (
          <CartFooter
            title={'Servicios'}
            servicesNumber={user.cart.services.length}
            servicesTotal={
              user.cart.services.length > 0
                ? _.sumBy(user.cart.services, 'total')
                : 0
            }
            onAction={() => this.setState({modalCart: true})}
          />
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
                  <Address />
                </View>

                <Loading type={'client'} loading={loading} />
              </>
            </Modal>

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
