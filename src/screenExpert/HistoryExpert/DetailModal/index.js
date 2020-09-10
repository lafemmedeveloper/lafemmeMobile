import React, {Fragment, useState, useEffect, useContext} from 'react';
import {
  Text,
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import Icon from 'react-native-vector-icons/FontAwesome5';

import {Colors, Fonts, ApplicationStyles, Metrics} from '../../../themes';
import ButtonMaps from './ButtonMaps';
import ExpandDetail from '../ExpandDetail';
import moment from 'moment';
import utilities from '../../../utilities';
import Geolocation from '@react-native-community/geolocation';
import {updateProfile} from '../../../flux/auth/actions';
import {
  sendCoordinate,
  updateStatus,
  setLoading,
} from '../../../flux/util/actions';
import Loading from '../../../components/Loading';
import {StoreContext} from '../../../flux';

const DetailModal = (props) => {
  const {state, authDispatch, utilDispatch} = useContext(StoreContext);
  const {auth, util} = state;
  const {user} = auth;
  const {loading} = util;

  // const orderStatusStr = {
  //   0: 'Buscando Expertos',
  //   1: 'Preparando Servicio',
  //   2: 'En Ruta',
  //   3: 'En servicio',
  //   4: 'Esperando Calificacion',
  //   5: 'Finalizado',
  //   6: 'Cancelado',
  // };//const {expertActiveOrders, deviceInfo} = util;
  const mapStyle = require('../../../config/mapStyle.json');

  const {order} = props;
  const {client, services, cartId} = order;
  const {address} = order;

  const screen = Dimensions.get('window');
  const ASPECT_RATIO = screen.width * 0.8 - 500 / screen.height;

  useEffect(() => {
    setLoading(true, utilDispatch);
    countdown(order.date);
    if (order.status === 2) {
      setInterval(() => {
        currentCoordinate();
      }, 10000);

      setLoading(false, utilDispatch);
    }

    setLoading(false, utilDispatch);
  }, []);

  const [menuIndex, setMenuIndex] = useState(0);
  const [dateCount, setDateCount] = useState('');
  const [activeStatus, setActiveStatus] = useState(false);
  const [coordinate, setCoordinate] = useState({});

  const getRemainingTime = (deadline) => {
    let now = new Date(),
      remainTime = (new Date(deadline) - now + 1000) / 1000,
      remainSeconds = ('0' + Math.floor(remainTime % 60)).slice(-2),
      remainMinutes = ('0' + Math.floor((remainTime / 60) % 60)).slice(-2),
      remainHours = ('0' + Math.floor((remainTime / 3600) % 24)).slice(-2),
      remainDays = Math.floor(remainTime / (3600 * 24));

    return {
      remainSeconds,
      remainMinutes,
      remainHours,
      remainDays,
      remainTime,
    };
  };

  const countdown = (deadline) => {
    const timerUpdate = setInterval(() => {
      let t = getRemainingTime(deadline);
      setDateCount(
        `${t.remainDays}d:${t.remainHours}h:${t.remainMinutes}m:${t.remainSeconds}s`,
      );
      console.log('t.remainHours =====>', t.remainHours);
      if (t.remainDays <= 1) {
        clearInterval(timerUpdate);
        setActiveStatus(true);
      }
    }, 1000);
  };

  const onRut = async () => {
    if (!activeStatus) {
      Alert.alert('Ups', `Aun faltan : ${dateCount} para continuar`);
    } else {
      await updateStatus(2, order.id, utilDispatch);
    }
  };

  const currentCoordinate = () => {
    Geolocation.getCurrentPosition((info) =>
      updateProfile(
        {
          latitude: info.coords.latitude,
          longitude: info.coords.longitude,
        },
        'coordinate',
        authDispatch,
      ),
    );

    console.log('coordinate =====>', coordinate);
  };

  const sendLocation = async () => {
    currentCoordinate();
    if (order.status === 2) {
      try {
        sendCoordinate(user, order, utilDispatch);
      } catch (error) {
        console.log('error sendLocation =>', error);
      }
    }
  };

  return (
    <>
      <Loading type={'expert'} loading={loading} />

      <View style={styles.container}>
        <View style={styles.contButtonMap}>
          <ButtonMaps goLocation={sendLocation} />
        </View>

        <MapView
          pointerEvents={'none'}
          provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          style={styles.mapView}
          customMapStyle={mapStyle}
          region={{
            latitude: order.address.coordinates.latitude,
            longitude: order.address.coordinates.longitude,
            latitudeDelta: 0.00001,
            longitudeDelta: 0.0001 * ASPECT_RATIO,
          }}>
          <Marker.Animated
            coordinate={{
              latitude: order.address.coordinates.latitude,
              longitude: order.address.coordinates.longitude,
            }}>
            <Icon
              name={'map-marker-alt'}
              size={30}
              color={Colors.client.primaryColor}
            />
          </Marker.Animated>
          <Marker
            coordinate={{
              latitude: order.experts.coordinate.latitude,
              longitude: order.experts.coordinate.longitude,
            }}>
            <Icon
              name={'map-marker-alt'}
              size={30}
              color={Colors.expert.primaryColor}
            />
          </Marker>
        </MapView>

        <View style={styles.bordered} />
        <Text
          style={[
            Fonts.style.regular(Colors.dark, Fonts.size.h5, 'left'),
            {marginLeft: 20, paddingTop: 35},
          ]}>
          {'Detalle de la orden'}{' '}
          <Text
            style={[
              Fonts.style.regular(
                Colors.expert.primaryColor,
                Fonts.size.h6,
                'left',
              ),
              {marginLeft: 20},
            ]}>
            {cartId}
          </Text>
        </Text>

        <ScrollView style={styles.contDetail}>
          {/* Container */}

          <ExpandDetail
            title={'Detalle de direccion'}
            icon={'map-marker-alt'}
            action={() => {
              setMenuIndex(menuIndex === 1 ? 0 : 1);
            }}
          />

          {menuIndex === 1 && (
            <View style={styles.contExpand}>
              <Text
                style={[
                  Fonts.style.regular(Colors.dark, Fonts.size.medium, 'left'),
                  {marginLeft: 20},
                ]}>
                Entregar en: {address.name}
              </Text>
              <Text
                style={[
                  Fonts.style.regular(Colors.dark, Fonts.size.medium, 'left'),
                  {marginLeft: 20},
                ]}>
                Barrio: {address.neighborhood}
              </Text>
              <Text
                style={[
                  Fonts.style.regular(Colors.dark, Fonts.size.medium, 'left'),
                  {marginLeft: 20},
                ]}>
                Nota: {address.notesAddress}
              </Text>
            </View>
          )}

          <View opacity={0.25} style={ApplicationStyles.separatorLine} />

          <ExpandDetail
            title={'Detalle del cliente'}
            icon={'user-alt'}
            action={() => {
              setMenuIndex(menuIndex === 2 ? 0 : 2);
            }}
          />
          {menuIndex === 2 && (
            <View style={styles.contExpand}>
              <Text
                style={[
                  Fonts.style.regular(Colors.dark, Fonts.size.medium, 'left'),
                  {marginLeft: 20},
                ]}>
                Preguntar por: {`${client.firstName} ${client.lastName}`}
              </Text>
            </View>
          )}

          <View opacity={0.25} style={ApplicationStyles.separatorLine} />
          <ExpandDetail
            title={'Detalle del servicio'}
            icon={'border-all'}
            action={() => {
              setMenuIndex(menuIndex === 3 ? 0 : 3);
            }}
          />
          {menuIndex === 3 && (
            <View style={styles.contExpand}>
              {services &&
                services.map((item, index) => {
                  const {name, clients, addOnsCount, addons} = item;
                  console.log('addons =========>', addons);

                  return (
                    <Fragment key={index}>
                      <Text
                        style={[
                          Fonts.style.regular(
                            Colors.dark,
                            Fonts.size.medium,
                            'center',
                          ),
                          {marginLeft: 20},
                        ]}>
                        Producto: {name}
                      </Text>
                      <Text
                        style={[
                          Fonts.style.regular(
                            Colors.dark,
                            Fonts.size.medium,
                            'center',
                          ),
                          {marginLeft: 20},
                        ]}>
                        Para: {clients.length} Personas
                      </Text>
                      <View opacity={0.25} style={styles.separatorLineMini} />

                      <Text
                        style={[
                          Fonts.style.regular(
                            Colors.dark,
                            Fonts.size.medium,
                            'center',
                          ),
                          {marginVertical: 10},
                        ]}>
                        Addicionales comunes
                      </Text>
                      {addons.length > 0 ? (
                        addons.map((dataAddon) => {
                          const {addonName, id} = dataAddon;
                          console.log('name ', dataAddon);
                          return (
                            <Fragment key={id}>
                              <Text
                                style={[
                                  Fonts.style.regular(
                                    Colors.dark,
                                    Fonts.size.medium,
                                    'center',
                                  ),
                                  {marginLeft: 20},
                                ]}>
                                Adicional: {addonName}
                              </Text>
                            </Fragment>
                          );
                        })
                      ) : (
                        <Text
                          style={[
                            Fonts.style.regular(
                              Colors.dark,
                              Fonts.size.medium,
                              'center',
                            ),
                            {marginLeft: 20},
                          ]}>
                          No ahi adiciones comunes
                        </Text>
                      )}
                      <View opacity={0.25} style={styles.separatorLineMini} />

                      <Text
                        style={[
                          Fonts.style.regular(
                            Colors.dark,
                            Fonts.size.medium,
                            'center',
                          ),
                          {marginVertical: 10},
                        ]}>
                        Addicionales contable
                      </Text>
                      {addOnsCount.length > 0 ? (
                        addOnsCount.map((addonCount) => {
                          const {name, count, id} = addonCount;
                          return (
                            <Fragment key={id}>
                              <Text
                                style={[
                                  Fonts.style.regular(
                                    Colors.dark,
                                    Fonts.size.medium,
                                    'center',
                                  ),
                                  {marginLeft: 20},
                                ]}>
                                Addiconal: {name}
                              </Text>
                              <Text
                                style={[
                                  Fonts.style.regular(
                                    Colors.dark,
                                    Fonts.size.medium,
                                    'center',
                                  ),
                                  {marginLeft: 20},
                                ]}>
                                Cantidad: {count}
                              </Text>
                            </Fragment>
                          );
                        })
                      ) : (
                        <Text
                          style={[
                            Fonts.style.regular(
                              Colors.dark,
                              Fonts.size.medium,
                              'center',
                            ),
                            {marginLeft: 20},
                          ]}>
                          No ahi adiciones contables
                        </Text>
                      )}
                    </Fragment>
                  );
                })}
            </View>
          )}
          <View opacity={0.25} style={ApplicationStyles.separatorLine} />

          <ExpandDetail
            title={'Detalle de como cobrar'}
            icon={'money-bill-wave'}
            action={() => {
              setMenuIndex(menuIndex === 4 ? 0 : 4);
            }}
          />
          {menuIndex === 4 && (
            <View style={styles.contExpand}>
              {services &&
                services.map((item, index) => {
                  const {duration, total, totalAddons, totalServices} = item;

                  return (
                    <Fragment key={index}>
                      <Text
                        style={[
                          Fonts.style.regular(
                            Colors.dark,
                            Fonts.size.medium,
                            'left',
                          ),
                          {marginLeft: 20},
                        ]}>
                        duracion : {duration} mins
                      </Text>

                      <Text
                        style={[
                          Fonts.style.regular(
                            Colors.dark,
                            Fonts.size.medium,
                            'left',
                          ),
                          {marginLeft: 20},
                        ]}>
                        SubTotal : {utilities.formatCOP(totalServices)}
                      </Text>
                      <Text
                        style={[
                          Fonts.style.regular(
                            Colors.dark,
                            Fonts.size.medium,
                            'left',
                          ),
                          {marginLeft: 20},
                        ]}>
                        Adiciones : {utilities.formatCOP(totalAddons)}
                      </Text>
                      <Text
                        style={[
                          Fonts.style.regular(
                            Colors.dark,
                            Fonts.size.medium,
                            'left',
                          ),
                          {marginLeft: 20},
                        ]}>
                        total de servicios: {utilities.formatCOP(total)}
                      </Text>
                    </Fragment>
                  );
                })}
            </View>
          )}
          <View opacity={0.25} style={ApplicationStyles.separatorLine} />
          <ExpandDetail
            title={'Agenda'}
            icon={'calendar'}
            action={() => {
              setMenuIndex(menuIndex === 5 ? 0 : 5);
            }}
          />
          {menuIndex === 5 && (
            <View style={styles.contExpand}>
              <Text
                style={[
                  Fonts.style.regular(Colors.dark, Fonts.size.medium, 'left'),
                  {marginLeft: 20},
                ]}>
                Fecha: {moment(order.date).format('llll')}
              </Text>
            </View>
          )}
        </ScrollView>
        <TouchableOpacity onPress={() => onRut()} style={[styles.btnContainer]}>
          <View style={styles.conText}>
            {order.status === 1 && (
              <Text
                style={[
                  Fonts.style.bold(Colors.light, Fonts.size.medium),
                  {alignItems: 'center'},
                ]}>
                Colocarme en ruta
              </Text>
            )}
            {order.status === 2 && (
              <Text
                style={[
                  Fonts.style.bold(Colors.light, Fonts.size.medium),
                  {alignItems: 'center'},
                ]}>
                Colocarme en servicio
              </Text>
            )}
            {order.status === 3 && (
              <Text
                style={[
                  Fonts.style.bold(Colors.light, Fonts.size.medium),
                  {alignItems: 'center'},
                ]}>
                Finalizando servicio
              </Text>
            )}
          </View>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '95%',
  },
  mapView: {
    width: '100%',
    height: 200,
  },
  contButtonMap: {
    position: 'absolute',
    flex: 0,
    justifyContent: 'flex-end',
    zIndex: 20,
    alignSelf: 'flex-end',
    top: 50,
    right: 20,
  },
  bordered: {
    backgroundColor: Colors.light,
    width: '100%',
    height: 30,
    zIndex: 30,
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
    position: 'absolute',
    marginTop: 170,
  },
  contDetail: {
    paddingTop: 20,
    marginBottom: -100,
  },
  contExpand: {
    marginLeft: 50,
    marginVertical: 20,
    backgroundColor: Colors.background,

    padding: 10,
    borderRadius: 10,
    width: '80%',
  },
  separatorLineMini: {
    width: Metrics.screenWidth * 0.5,
    alignSelf: 'center',
    height: 0.5,
    backgroundColor: Colors.dark,
    marginVertical: 20,
  },
  btnContainer: {
    backgroundColor: Colors.expert.primaryColor,
    height: 60,
    width: '100%',
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    bottom: -35,
  },
  conText: {
    alignSelf: 'center',
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'center',
  },
});

export default DetailModal;
