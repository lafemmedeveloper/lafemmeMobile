import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  Alert,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import firestore from '@react-native-firebase/firestore';
import {Colors, Images, Fonts, ApplicationStyles, Metrics} from '../../Themes';
import auth from '@react-native-firebase/auth';
import MyTextInput from '../../Components/MyTextInput';
import CardItemCart from '../../Components/CardItemCart';
import FieldCartConfig from '../../Components/FieldCartConfig';
import styles from './styles';
import {ScrollView} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome5';

import ExpandOrderData from '../../Components/ExpandOrderData';
import ExpandHistoryData from '../../Components/ExpandHistoryData';

import {getDate, formatDate} from '../../Helpers/MomentHelper';
import DatePicker from 'react-native-datepicker';
import _ from 'lodash';
import Utilities from '../../Utilities';
import {msToDate, msToDay, msToHour} from '../../Helpers/MomentHelper';
import moment from 'moment';
import MapView, {
  PROVIDER_GOOGLE,
  Marker,
  AnimatedRegion,
} from 'react-native-maps';
import Modal from 'react-native-modal';
import Login from '../Login/Content';
import Register from '../Register/Content';
// import { getOrders } from '../../Core/Services/Actions';

const config = {
  minHour: moment('08:00').format('HH:mm'),
  maxHour: moment('20:00').format('HH:mm'),
};

const screen = Dimensions.get('window');
const ASPECT_RATIO = screen.width * 0.8 - 500 / screen.height;
const LATITUDE_DELTA = 0.0003;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const mapStyle = require('../../Config/mapStyle.json');

export default class Orders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toggleType: 0,
      date: getDate(1),
      day: getDate(1),
      hour: moment(new Date())
        .add(1.5, 'hour')
        .format('HH:mm'),

      modalAuth: false,
      isLogin: true,
    };
  }

  async componentDidMount() {
    const {user, getCoverage, setLoading, getOrders} = this.props;
    setLoading(true);
    await getCoverage('Medellín');

    if (user) {
      await getOrders();
    }
    setLoading(false);
  }

  async sendOrder(data) {
    const {user, updateProfile, setLoading, orders} = this.props;
    setLoading(true);
    try {
      firestore()
        .collection('orders')
        .doc()
        .set(data)
        .then(function() {
          console.log('order:Created');

          try {
            updateProfile(
              {
                ...orders[0],
                day: null,
                address: null,
                hour: null,
                notes: null,
                services: [],
                coupon: null,
              },
              'cart',
            );
          } catch (error) {}
        })
        .catch(function(error) {
          console.error('Error saving order : ', error);
        });

      // await firestore()
      //   .collection('orders')
      //   .set(data);
      // setLoading(false);
    } catch (error) {
      console.log('sendOrder:error', error);
    }
    this.props.closeModal();
    setLoading(false);
  }

  async removeCartItem(id) {
    const {updateProfile, orders, setLoading} = this.props;

    let services = orders[0].services;

    const index = services ? services.findIndex(i => i.id === id) : -1;

    if (index !== -1) {
      services = [...services.slice(0, index), ...services.slice(index + 1)];

      setLoading(true);

      await updateProfile({...orders[0], services}, 'cart');

      setLoading(false);
    }
  }

  async cancelOrder(id) {
    const {setLoading, cancelOrder} = this.props;

    setLoading(true);

    console.log('cancelOrder', id);
    cancelOrder(id);
    setLoading(true);
    // try {
    //   await updateProfile({...orders[0], day}, 'cart');
    //   this.setState({day});
    // } catch (err) {
    //   console.log('updateDay:error', err);
    // }

    setLoading(false);
  }

  render() {
    const {
      user,
      orders,
      history,
      loading,
      navigation,
      setLoading,
      deviceInfo,
      getOrders,
      setAccount,
      appType,
      logOut,
      setTempRegister,
    } = this.props;
    const {toggleType, isLogin, modalAuth} = this.state;

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
                // navigation.navigate('Home', {});
                // this.handleLogin();
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
          <View opacity={0.0} style={ApplicationStyles.separatorLine} />
          <Image
            source={Images.billResume}
            style={{
              width: 40,
              height: 40,
              resizeMode: 'contain',
              alignSelf: 'center',
              marginBottom: 10,
            }}
          />
          <Text
            style={[
              Fonts.style.semiBold(Colors.dark, Fonts.size.h6, 'center'),
              {marginBottom: 10},
            ]}>
            {'Mis servicios'}
          </Text>
          {/* <View opacity={0.0} style={ApplicationStyles.separatorLine} /> */}
        </View>
        <View
          style={{
            width: Metrics.screenWidth * 0.9,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignSelf: 'center',
          }}>
          <TouchableOpacity
            onPress={() => {
              this.setState({toggleType: 0});
            }}
            style={[
              styles.headerBtn,
              {
                backgroundColor:
                  toggleType === 0
                    ? Colors.client.primaryColor
                    : Colors.disabledBtn,
              },
            ]}>
            <Text
              style={Fonts.style.semiBold(
                toggleType === 0 ? Colors.light : Colors.dark,
                Fonts.size.medium,
                'center',
              )}>
              {'Próximos Servicios'}
            </Text>
          </TouchableOpacity>
          <View style={{width: 5}} />
          <TouchableOpacity
            onPress={() => {
              this.setState({toggleType: 1});
            }}
            style={[
              styles.headerBtn,
              {
                backgroundColor:
                  toggleType === 1
                    ? Colors.client.primaryColor
                    : Colors.disabledBtn,
              },
            ]}>
            <Text
              style={Fonts.style.semiBold(
                toggleType === 1 ? Colors.light : Colors.dark,
                Fonts.size.medium,
                'center',
              )}>
              {'Historial'}
            </Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.contentContainer}>
          {toggleType === 0 &&
            orders.map((item, index) => {
              return (
                <View key={item.id}>
                  <ExpandOrderData
                    user={user}
                    order={item}
                    cancelOrder={orderId => {
                      this.cancelOrder(orderId);
                    }}
                  />

                  {index < orders.length - 1 && (
                    <View
                      opacity={0.0}
                      style={ApplicationStyles.separatorLine}
                    />
                  )}
                </View>
              );
            })}
          {toggleType === 1 &&
            history.map((item, index) => {
              return (
                <View key={item.id}>
                  <ExpandHistoryData order={item} appType={appType} />
                </View>
              );
            })}

          {toggleType === 0 && orders.length === 0 && (
            <View style={styles.containerNoUSer}>
              <Text
                style={Fonts.style.semiBold(
                  Colors.dark,
                  Fonts.size.h6,
                  'center',
                )}>
                {'Ups...'}
              </Text>
              <View style={{height: 10}} />
              <Text
                style={Fonts.style.regular(
                  Colors.dark,
                  Fonts.size.medium,
                  'center',
                )}>
                {'No encontramos ordenes activas en nuestro sistema'}
              </Text>
            </View>
          )}

          {toggleType === 1 && history.length === 0 && (
            <View style={styles.containerNoUSer}>
              <Text
                style={Fonts.style.semiBold(
                  Colors.dark,
                  Fonts.size.h6,
                  'center',
                )}>
                {'Ups...'}
              </Text>
              <View style={{height: 10}} />
              <Text
                style={Fonts.style.regular(
                  Colors.dark,
                  Fonts.size.medium,
                  'center',
                )}>
                {'No encontramos ordenes pasadas en nuestro sistema'}
              </Text>
            </View>
          )}

          <View
            style={{
              width: Metrics.screenWidth * 0.9,
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignSelf: 'center',
              marginVertical: 20,
            }}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Home');
              }}
              style={[
                styles.btnGeneric,
                {
                  backgroundColor: Colors.client.primaryColor,
                  flex: 0,
                  paddingHorizontal: 20,
                },
              ]}>
              <Text
                style={Fonts.style.semiBold(
                  Colors.light,
                  Fonts.size.medium,
                  'center',
                )}>
                {'Crear nuevo servicio'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{height: Metrics.addFooter + 20}} />
        </ScrollView>
      </View>
    );
  }
}
