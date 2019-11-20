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
var locationIcon = {
  0: 'home',
  1: 'building',
  2: 'concierge-bell',
  3: 'map-pin',
};

const config = {
  minHour: moment('08:00').format('HH:mm'),
  maxHour: moment('20:00').format('HH:mm'),
};

const screen = Dimensions.get('window');
const ASPECT_RATIO = screen.width * 0.8 - 500 / screen.height;
const LATITUDE_DELTA = 0.0003;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const mapStyle = require('../../Config/mapStyle.json');

var orderStatusStr = {
  0: 'Buscando Expertos',
  1: 'En Calendario',
  2: 'En Ruta',
  3: 'En servicio',
  4: 'Esperando Calificacion',
  5: 'Finalizado',
  6: 'Cancelado',
};

export default class Cart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toggleType: 0,
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
    const {user, updateProfile, orders, setLoading} = this.props;

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
    const {user, updateProfile, orders, setLoading} = this.props;
    setLoading(true);

    console.log('cancelOrder', id);
    // try {
    //   await updateProfile({...orders[0], day}, 'cart');
    //   this.setState({day});
    // } catch (err) {
    //   console.log('updateDay:error', err);
    // }

    setLoading(false);
  }

  render() {
    const {user, orders} = this.props;
    const {toggleType} = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <View opacity={0.0} style={ApplicationStyles.separatorLine} />
          <Text style={Fonts.style.bold(Colors.dark, Fonts.size.h6, 'center')}>
            {'Orden de Servicio'}
          </Text>
          <View opacity={0.0} style={ApplicationStyles.separatorLine} />
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
                  toggleType === 0 ? Colors.client.primartColor : Colors.gray,
              },
            ]}>
            <Text
              style={Fonts.style.bold(
                Colors.light,
                Fonts.size.medium,
                'center',
              )}>
              {'Ordenes Activas'}
            </Text>
          </TouchableOpacity>
          <View style={{width: 5}}></View>
          <TouchableOpacity
            onPress={() => {
              this.setState({toggleType: 1});
            }}
            style={[
              styles.headerBtn,
              {
                backgroundColor:
                  toggleType === 1 ? Colors.client.primartColor : Colors.gray,
              },
            ]}>
            <Text
              style={Fonts.style.bold(
                Colors.light,
                Fonts.size.medium,
                'center',
              )}>
              {'Historial'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.contentContainer}>
          <Image
            source={Images.moto}
            style={{
              alignSelf: 'center',
              resizeMode: 'contain',
              marginTop: 30,
              width: Metrics.screenWidth / 1.2,
              // heigth: Metrics.screenWidth / 1.2,
            }}
          />
          <View
            style={{
              backgroundColor: Colors.status[orders[0].status],
              width: '50%',
              alignSelf: 'center',
              // smarginTop: 5,
              // justifyContent: 'center',
              // alignItems: 'center',
              borderRadius: 10,
              paddingHorizontal: 10,
              marginVertical: 20,
            }}>
            <Text
              numberOfLines={1}
              style={Fonts.style.bold(
                Colors.light,
                Fonts.size.medium,
                'center',
              )}>
              {orderStatusStr[orders[0].status]}
            </Text>
          </View>

          {user &&
            orders[0].services.map((item, index) => {
              return (
                <CardItemCart
                  isCart={false}
                  showExperts={true}
                  startHour={orders[0].hour}
                  key={index}
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
                _.sumBy(orders[0].services, 'totalServices'),
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
              {Utilities.formatCOP(_.sumBy(orders[0].services, 'totalAddons'))}
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
              {Utilities.formatCOP(_.sumBy(orders[0].services, 'total'))}
            </Text>
          </View>

          <View opacity={0.0} style={ApplicationStyles.separatorLine} />
          {user && orders[0] && (
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
              <View>
                <FieldCartConfig
                  key={'address'}
                  value={orders[0].address ? orders[0].address : false}
                  textActive={
                    orders[0].address && `${orders[0].address.formattedAddress}`
                  }
                  textSecondary={
                    orders[0].address && orders[0].address.addressDetail
                      ? `${orders[0].address.addressDetail}`
                      : ''
                  }
                  textInactive={'+ Agregar una dirección'}
                  icon={
                    orders[0].address
                      ? locationIcon[orders[0].address.type]
                      : 'map-marker-alt'
                  }
                />

                <View
                  pointerEvents={'none'}
                  style={{
                    // flex: 1,
                    // marginBottom: 60 + Metrics.addFooter - 10,
                    width: Metrics.screenWidth * 0.9,
                    height: 200,
                    marginTop: 5,
                    borderRadius: 10,
                    overflow: 'hidden',
                    marginBottom: 10,
                    alignSelf: 'center',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                  }}>
                  <MapView
                    provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                    style={{
                      ...StyleSheet.absoluteFillObject,
                    }}
                    customMapStyle={mapStyle}
                    region={{
                      latitude: orders[0].address.coordinates.latitude,
                      longitude: orders[0].address.coordinates.longitude,
                      latitudeDelta: 0.00001,
                      longitudeDelta: 0.00001 * ASPECT_RATIO,
                    }}>
                    <Marker.Animated
                      coordinate={{
                        latitude: orders[0].address.coordinates.latitude,
                        longitude: orders[0].address.coordinates.longitude,
                      }}
                      // identifier={`coordinate_${index}`}
                      // heading={coordinate.heading ? coordinate.heading : 0}
                    >
                      <Icon
                        name={'map-marker-alt'}
                        size={30}
                        color={Colors.client.primartColor}
                      />
                    </Marker.Animated>
                  </MapView>
                </View>
              </View>
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
                  value={orders[0].day ? orders[0].day : false}
                  textActive={`${formatDate(orders[0].day, 'dddd, LL')}`}
                  textInactive={'+ Selecciona la fecha del servicio'}
                  icon={'calendar'}
                />
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
                  value={orders[0].hour ? orders[0].hour : false}
                  textActive={`${formatDate(
                    moment(orders[0].hour, 'HH:mm'),
                    'h:mm a',
                  )}`}
                  textInactive={'+ Selecciona la hora del servicio'}
                  icon={'clock'}
                />
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

              <FieldCartConfig
                key={'comments'}
                textSecondary={''}
                value={orders[0].notes ? orders[0].notes : false}
                textActive={orders[0].notes}
                textInactive={'+ Agregar notas o comentarios'}
                icon={'comment-alt'}
              />
            </>
          )}
          <View opacity={0.0} style={ApplicationStyles.separatorLine} />
        </ScrollView>
      </View>
    );
  }
}
