import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  Alert,
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

import {getDate, formatDate} from '../../Helpers/MomentHelper';
import DatePicker from 'react-native-datepicker';
import _ from 'lodash';
import Utilities from '../../Utilities';
import {msToDate, msToDay, msToHour} from '../../Helpers/MomentHelper';
import moment from 'moment';
import AppConfig from '../../Config/AppConfig';

const config = {
  minHour: moment('08:00').format('HH:mm'),
  maxHour: moment('20:00').format('HH:mm'),
};
export default class Cart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: getDate(1),
      day: getDate(1),
      hour: moment(new Date())
        .add(1.5, 'hour')
        .format('HH:mm'),
    };
  }

  async componentDidMount() {
    const {getCoverage, setLoading} = this.props;
    setLoading(true);
    await getCoverage('Medellín');
    setLoading(false);
  }

  async sendOrder(data) {
    const {user, updateProfile, setLoading} = this.props;
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
                ...user.cart,
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
    const {user, updateProfile, setLoading} = this.props;

    let services = user.cart.services;

    const index = services ? services.findIndex(i => i.id === id) : -1;

    if (index !== -1) {
      services = [...services.slice(0, index), ...services.slice(index + 1)];

      setLoading(true);

      await updateProfile({...user.cart, services}, 'cart');

      setLoading(false);
    }
  }

  async updateDay(day) {
    const {user, updateProfile, setLoading} = this.props;
    setLoading(true);
    try {
      await updateProfile({...user.cart, day}, 'cart');
      this.setState({day});
    } catch (err) {
      console.log('updateDay:error', err);
    }

    setLoading(false);
  }

  async updateHour(hour) {
    const {user, updateProfile, setLoading} = this.props;
    setLoading(true);
    try {
      await updateProfile({...user.cart, hour}, 'cart');
      this.setState({hour});
    } catch (err) {
      console.log('updateHour:error', err);
    }

    setLoading(false);
  }

  async uploadCoverageZone() {
    console.log('uploadCoverageZones');
    var coverage = require('../../Config/Poligons.json');

    console.log('coverage', coverage);

    for (let index = 0; index < coverage.length; index++) {
      console.log(coverage[index].id, index, '/', coverage.length);

      await firestore()
        .collection('coverageZones')
        .doc(coverage[index].id)
        .set(
          {
            ...coverage[index],
          },
          {merge: true},
        );
    }
  }

  render() {
    const {user} = this.props;

    let isCompleted =
      user.cart.address &&
      user.cart.day &&
      user.cart.hour &&
      user.cart.services.length > 0 &&
      user.cart.notes;
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <View opacity={0.0} style={ApplicationStyles.separatorLine} />
          <Text style={Fonts.style.bold(Colors.dark, Fonts.size.h6, 'center')}>
            {'Resumen del Servicio'}
          </Text>

          <Text
            style={Fonts.style.regular(
              Colors.gray,
              Fonts.size.small,
              'center',
            )}>
            {'Agrega los servicios segun el orden que deseas recibirlos.'}
          </Text>
          <View opacity={0.0} style={ApplicationStyles.separatorLine} />
        </View>
        <ScrollView style={styles.contentContainer}>
          {user &&
            user.cart &&
            user.cart.services &&
            user.cart.services.map((item, index) => {
              return (
                <CardItemCart
                  key={index}
                  isCart={true}
                  showExperts={false}
                  data={item}
                  removeItem={id => {
                    Alert.alert(
                      'Alerta',
                      'Realmente desea eliminar este item de tu lista.',
                      [
                        {
                          text: 'Eliminar',
                          onPress: () => {
                            console.log('removeItem', id);
                            this.removeCartItem(id);
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
                />
              );
            })}
          <TouchableOpacity
            onPress={() => {
              this.props.closeModal();
            }}
            style={[
              styles.productContainer,
              {backgroundColor: Colors.client.primartColor},
            ]}>
            <Text
              style={Fonts.style.bold(
                Colors.light,
                Fonts.size.medium,
                'center',
              )}>
              {'+ Agregar servicios'}
            </Text>
          </TouchableOpacity>

          <View opacity={0.0} style={ApplicationStyles.separatorLine} />

          <View style={styles.totalContainer}>
            <Text
              style={Fonts.style.regular(
                Colors.client.primartColor,
                Fonts.size.medium,
                'left',
              )}>
              {'Total Servicios:'}
            </Text>
            <Text
              style={Fonts.style.regular(
                Colors.gray,
                Fonts.size.medium,
                'left',
              )}>
              {Utilities.formatCOP(
                _.sumBy(user.cart.services, 'totalServices'),
              )}
            </Text>
          </View>
          <View style={styles.totalContainer}>
            <Text
              style={Fonts.style.regular(
                Colors.client.primartColor,
                Fonts.size.medium,
                'left',
              )}>
              {'Total Adicionales:'}
            </Text>
            <Text
              style={Fonts.style.regular(
                Colors.gray,
                Fonts.size.medium,
                'left',
              )}>
              {Utilities.formatCOP(_.sumBy(user.cart.services, 'totalAddons'))}
            </Text>
          </View>

          <View style={styles.totalContainer}>
            <Text
              style={Fonts.style.bold(
                Colors.client.primartColor,
                Fonts.size.medium,
                'left',
              )}>
              {'Total:'}
            </Text>
            <Text
              style={Fonts.style.bold(Colors.dark, Fonts.size.medium, 'left')}>
              {Utilities.formatCOP(_.sumBy(user.cart.services, 'total'))}
            </Text>
          </View>

          <View opacity={0.0} style={ApplicationStyles.separatorLine} />
          {user && user.cart && (
            <>
              <View style={styles.itemTitleContainer}>
                <Text
                  style={Fonts.style.regular(
                    Colors.client.primartColor,
                    Fonts.size.medium,
                    'left',
                  )}>
                  {'Ubicacion del servicio'}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  this.props.modalAddress();
                }}>
                <FieldCartConfig
                  key={'address'}
                  value={user.cart.address ? user.cart.address : false}
                  textActive={
                    user.cart.address && `${user.cart.address.formattedAddress}`
                  }
                  textSecondary={
                    user.cart.address && user.cart.address.addressDetail
                      ? `${user.cart.address.addressDetail}`
                      : ''
                  }
                  textInactive={'+ Agregar una dirección'}
                  icon={
                    user.cart.address
                      ? AppConfig.locationIcon[user.cart.address.type]
                      : 'map-marker-alt'
                  }
                />
              </TouchableOpacity>
              {/* date */}
              <View style={styles.itemTitleContainer}>
                <Text
                  style={Fonts.style.regular(
                    Colors.client.primartColor,
                    Fonts.size.medium,
                    'left',
                  )}>
                  {'Fecha del servicio'}
                  {'\n'}
                  <Text
                    style={Fonts.style.regular(
                      Colors.gray,
                      Fonts.size.small,
                      'left',
                    )}>
                    {'Selecciona el dia que deseas el servicio.'}
                  </Text>
                </Text>
              </View>
              <View>
                <FieldCartConfig
                  key={'date'}
                  textSecondary={''}
                  value={user.cart.day ? user.cart.day : false}
                  textActive={`${formatDate(user.cart.day, 'dddd, LL')}`}
                  textInactive={'+ Selecciona la fecha del servicio'}
                  icon={'calendar'}
                />

                <View
                  opacity={0.0}
                  style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    flex: 1,
                    backgroundColor: 'red',
                  }}>
                  <DatePicker
                    date={this.state.day}
                    locale={'es'}
                    showIcon={false}
                    confirmBtnText={'Confirmar'}
                    cancelBtnText={'Cancelar'}
                    minDate={moment(new Date()).format('YYYY-MM-DD')}
                    maxDate={moment(new Date())
                      .add(30, 'days')
                      .format('YYYY-MM-DD')}
                    placeholder={'text'}
                    mode={'date'}
                    format={'YYYY-MM-DD'}
                    // style={{width: 200, height: 100, backgroundColor: 'green'}}
                    customStyles={{
                      dateInput: {
                        borderWidth: 0,
                        right: 30,
                      },
                      dateText: {
                        marginTop: 10,
                        color: 'red',
                        fontSize: 16,
                        fontFamily: Fonts.type.regular,
                      },
                      placeholderText: {
                        color: 'blue',
                        fontSize: 16,
                        width: '100%',
                        fontFamily: Fonts.type.regular,
                        justifyContent: 'center',
                        flex: 1,
                        textAlign: 'center',
                        flexDirection: 'row',
                        marginTop: 9,
                        left: 20,
                      },
                    }}
                    onDateChange={day => {
                      this.updateDay(day);
                      // this.setState({day});
                      // this.setDateTime(event, date);
                    }}
                    placeholderTextColor={'purple'}
                    underlineColorAndroid={'rgba(0,0,0,0)'}
                    is24Hour={true}
                    androidMode="spinner"
                    style={{
                      width: '100%',
                      height: '100%',
                    }}
                  />
                </View>
              </View>
              {/* endDate */}

              {/* time */}
              <View style={styles.itemTitleContainer}>
                <Text
                  style={Fonts.style.regular(
                    Colors.client.primartColor,
                    Fonts.size.medium,
                    'left',
                  )}>
                  {'Hora del servicio'}
                  {'\n'}
                  <Text
                    style={Fonts.style.regular(
                      Colors.gray,
                      Fonts.size.small,
                      'left',
                    )}>
                    {'Selecciona la hora estimada para el servicio.'}
                  </Text>
                </Text>
              </View>
              <View>
                <FieldCartConfig
                  key={'hour'}
                  textSecondary={''}
                  value={user.cart.hour ? user.cart.hour : false}
                  textActive={`${formatDate(
                    moment(user.cart.hour, 'HH:mm'),
                    'h:mm a',
                  )}`}
                  textInactive={'+ Selecciona la hora del servicio'}
                  icon={'clock'}
                />

                <View
                  opacity={0.0}
                  style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    flex: 1,
                    backgroundColor: 'red',
                  }}>
                  <DatePicker
                    date={this.state.hour}
                    locale={'es'}
                    showIcon={false}
                    confirmBtnText={'Confirmar'}
                    cancelBtnText={'Cancelar'}
                    minTime={moment(new Date())
                      .add(1, 'hour')
                      .format('HH:mm')}
                    maxTime={'00:00'}
                    placeholder={'text'}
                    mode={'time'}
                    format={'HH:mm'}
                    // style={{width: 200, height: 100, backgroundColor: 'green'}}
                    customStyles={{
                      dateInput: {
                        borderWidth: 0,
                        right: 30,
                      },
                      dateText: {
                        marginTop: 10,
                        color: 'red',
                        fontSize: 16,
                        fontFamily: Fonts.type.regular,
                      },
                      placeholderText: {
                        color: 'blue',
                        fontSize: 16,
                        width: '100%',
                        fontFamily: Fonts.type.regular,
                        justifyContent: 'center',
                        flex: 1,
                        textAlign: 'center',
                        flexDirection: 'row',
                        marginTop: 9,
                        left: 20,
                      },
                    }}
                    onDateChange={hour => {
                      this.updateHour(hour);
                      // this.setDateTime(event, date);
                    }}
                    placeholderTextColor={'purple'}
                    underlineColorAndroid={'rgba(0,0,0,0)'}
                    is24Hour={false}
                    androidMode="spinner"
                    style={{
                      width: '100%',
                      height: '100%',
                    }}
                  />
                </View>
              </View>
              {/* endTime */}
              <View style={styles.itemTitleContainer}>
                <Text
                  style={Fonts.style.regular(
                    Colors.client.primartColor,
                    Fonts.size.medium,
                    'left',
                  )}>
                  {'Comentarios'}
                </Text>
              </View>
              <TouchableOpacity>
                <FieldCartConfig
                  key={'comments'}
                  textSecondary={''}
                  value={user.cart.notes ? user.cart.notes : false}
                  textActive={user.cart.notes}
                  textInactive={'+ Agregar notas o comentarios'}
                  icon={'comment-alt'}
                />
              </TouchableOpacity>
            </>
          )}
          <View opacity={0.0} style={ApplicationStyles.separatorLine} />

          <TouchableOpacity
            onPress={() => {
              this.uploadCoverageZone();
            }}>
            <Text>uploadCoverageZone</Text>
          </TouchableOpacity>
        </ScrollView>

        <View style={styles.footerContainer}>
          <TouchableOpacity
            onPress={() => {
              if (isCompleted) {
                console.log('isCompleted');
                let data = {
                  client: {
                    uid: user.uid,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    phone: user.phone,
                    rating: user.rating,
                  },
                  createDate: firestore.FieldValue.serverTimestamp(),
                  cartId: Utilities.create_CARTID(),
                  status: 0,
                  date: `${user.cart.day} ${user.cart.hour}`,
                  ...user.cart,
                };
                this.sendOrder(data);
                console.log('data', data);
              } else {
                Alert.alert(
                  'Ups...',
                  'Completa todos los items de tu orden para continuar.',
                );
              }
            }}
            style={[
              styles.btnContainer,
              {
                backgroundColor: isCompleted
                  ? Colors.client.primartColor
                  : Colors.gray,
              },
            ]}>
            <Text
              style={Fonts.style.bold(
                Colors.light,
                Fonts.size.medium,
                'center',
              )}>
              {'Reservar'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
