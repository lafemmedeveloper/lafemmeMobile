import React, {
  Fragment,
  useState,
  useContext,
  useRef,
  useEffect,
  useCallback,
} from 'react';
import {
  Text,
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  ActivityIndicator,
  Linking,
  Platform,
  AppState,
} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {
  Colors,
  Fonts,
  ApplicationStyles,
  Metrics,
  Images,
} from '../../../themes';
import utilities from '../../../utilities';
import {sendPushFcm, updateOrder} from '../../../flux/util/actions';
import {StoreContext} from '../../../flux';
import ModalApp from '../../../components/ModalApp';
import Qualify from '../../../components/Qualify';
import ServiceModal from './ServiceModal';
import ButonMenu from '../../../screen/ButonMenu';
import {minToHours} from '../../../helpers/MomentHelper';
import _ from 'lodash';
import moment from 'moment';
import Geolocation from '@react-native-community/geolocation';
import {updateProfile} from '../../../flux/auth/actions';

const DetailModal = ({order, setModalDetail}) => {
  const screen = Dimensions.get('window');
  const {state, utilDispatch, authDispatch} = useContext(StoreContext);
  const {util, auth} = state;
  const {user} = auth;
  const {ordersAll, loading, config} = util;
  const appState = useRef(AppState.currentState);

  const mapStyle = require('../../../config/mapStyle.json');

  const filterOrder = ordersAll.filter((o) => o.id === order.id)[0]
    ? ordersAll.filter((o) => o.id === order.id)[0]
    : order;

  const services =
    filterOrder?.services.filter((s) => s.uid === user.uid).length > 0
      ? filterOrder.services.filter((s) => s.uid === user.uid)
      : [];
  const ASPECT_RATIO = screen.width * 0.8 - 500 / screen.height;

  const [qualifyClient, setQualifyClient] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [menuIndex, setMenuIndex] = useState(0);
  const [itemService, setItemService] = useState(null);

  const getServiceStatus = (status) => {
    switch (status) {
      case 1:
        return 'Colocarme en ruta';
      case 2:
        return 'Colocarme en servicio';
      case 3:
        return 'Finalizando servicio';
      case 4:
        return 'Calificar cliente';
      case 5:
        return 'Servicio finalizado';
      case 6:
        return 'Esperando calificación';
      case 7:
        return 'Servicio cancelado';
      case 8:
        return 'Liquidado';
      default:
        return 'Finalizado';
    }
  };

  const changeStatus = (item) => {
    if (item.status === 1) {
      Alert.alert(
        'Hola',
        'Estas seguro(a) que quieres cambiar de estado.',
        [
          {
            text: 'Si',
            onPress: async () => {
              let resulTime = utilities.counting(
                filterOrder.hoursServices[menuIndex],
              );
              console.log('time order expert', resulTime);
              if (resulTime.remainHours > 1) {
                Alert.alert(
                  'Ups',
                  'Lo siento aun falta mas de una hora para esta orden',
                );
              } else {
                let currentOrder = filterOrder;
                let indexService = filterOrder.services.findIndex(
                  (s) => s.id === item.id,
                );
                currentOrder.services[indexService].status = 2;
                await updateOrder(filterOrder, utilDispatch);

                await validateStatusGlobal(2);

                let notification = {
                  title: 'Actualización de la orden',
                  body: `El experto  ${
                    user.firstName + ' ' + user.lastName
                  } va en camino  `,
                  content_available: true,
                  priority: 'high',
                };
                let dataPush = null;
                sendPushFcm(order.fcmClient, notification, dataPush);
              }
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
    } else if (item.status === 2) {
      Alert.alert(
        'Hola',
        'Estas seguro(a) que quieres cambiar de estado.',
        [
          {
            text: 'Si',
            onPress: async () => {
              let currentOrder = filterOrder;
              let indexService = filterOrder.services.findIndex(
                (s) => s.id === item.id,
              );
              currentOrder.services[indexService].status = 3;

              await updateOrder(filterOrder, utilDispatch);

              await validateStatusGlobal(3);

              let notification = {
                title: 'Servicio cancelado',
                body: `El cliente  ${
                  user.firstName + ' ' + user.lastName
                } a cancelado el servicio`,
                content_available: true,
                priority: 'high',
              };
              let dataPush = null;
              sendPushFcm(order.fcmExpert, notification, dataPush);
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
    } else if (item.status === 3) {
      Alert.alert(
        'Hola',
        'Estas seguro(a) que quieres cambiar de estado.',
        [
          {
            text: 'Si',
            onPress: async () => {
              let currentOrder = filterOrder;
              let indexService = filterOrder.services.findIndex(
                (s) => s.id === item.id,
              );
              currentOrder.services[indexService].status = 4;
              await updateOrder(filterOrder, utilDispatch);

              await validateStatusGlobal(4);

              let notification = {
                title: 'Actualización de la orden',
                body: `El experto  ${
                  user.firstName + ' ' + user.lastName
                } a finalizado el servicio de  ${currentOrder.services[
                  indexService
                ].servicesType
                  .toUpperCase()
                  .split('-')
                  .join(' ')}`,
                content_available: true,
                priority: 'high',
              };
              let dataPush = null;
              sendPushFcm(order.fcmClient, notification, dataPush);
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
    } else if (item.status === 4) {
      setQualifyClient(true);
    }
  };

  const close = () => {
    setModalEdit(false);
    setModalDetail(false);
  };
  const activeModalEdit = (item) => {
    setItemService(item);
    setModalEdit(true);
  };
  const handleMaps = () => {
    const scheme = Platform.select({
      ios: 'maps:0,0?q=',
      android: 'geo:0,0?q=',
    });
    const latLng = `${filterOrder.address.coordinates.latitude}, ${filterOrder.address.coordinates.longitude}`;
    const label = filterOrder.address.name;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });

    Linking.openURL(url);
  };
  const handleWhatsapp = () => {
    let message = 'La Femme';

    let URL = 'whatsapp://send?text=' + message + '&phone=' + config.phone;

    Linking.openURL(URL)
      .then((data) => {
        console.log('WhatsApp Opened');
      })
      .catch(() => {
        Alert.alert(
          'Al parecer Whatsapp no esta instalado, por favor instalado',
        );
      });
  };

  const validateStatusGlobal = useCallback(async () => {
    console.log('validateStatusGlobal');
    let currentServices = filterOrder.services;
    let currentOrder = filterOrder;

    const config = {
      skipPermissionRequests: Platform.OS === 'ios' ? true : false,
      authorizationLevel: 'auto',
    };

    Geolocation.setRNConfiguration(config);
    Geolocation.getCurrentPosition(async (info) => {
      await updateProfile(
        {
          latitude: info.coords.latitude,
          longitude: info.coords.longitude,
        },
        'coordinates',
        authDispatch,
      );
      currentOrder.experts[menuIndex].coordinates = {
        latitude: info.coords.latitude,
        longitude: info.coords.longitude,
      };
    });

    let orderServices = _.orderBy(currentServices, 'status', 'asc');

    currentOrder.status = orderServices[0].status;
    if (orderServices[0].status === 6) {
      currentOrder.timeLast = Date.now();
      currentOrder.timeLastCurrent = moment().format('DD/MM/Y');
    }

    await updateOrder(currentOrder, utilDispatch);
  }, [authDispatch, filterOrder, menuIndex, utilDispatch]);

  useEffect(() => {
    AppState.addEventListener('change', _handleAppStateChange);

    return () => {
      AppState.removeEventListener('change', _handleAppStateChange);
    };
  }, [_handleAppStateChange]);

  const _handleAppStateChange = useCallback(
    (nextAppState) => {
      //active and background
      appState.current = nextAppState;
      console.log('nextAppState =>', nextAppState);

      if (nextAppState === 'active') {
        Geolocation.getCurrentPosition((info) => {
          if (
            info.coords.longitude !== user.coordinates.longitude ||
            info.coords.latitude !== user.coordinates.latitude
          ) {
            validateStatusGlobal();
          }
        });
      } else {
        console.log('fondo');
      }
    },
    [
      user.coordinates.latitude,
      user.coordinates.longitude,
      validateStatusGlobal,
    ],
  );

  return (
    <>
      <View style={styles.container}>
        <ScrollView style={{}}>
          <Image
            source={Images.delivery}
            style={{
              width: 50,
              height: 50,
              resizeMode: 'contain',
              alignSelf: 'center',
              marginBottom: 10,
              tintColor: Colors.expert.primaryColor,
            }}
          />
          <Text style={Fonts.style.bold(Colors.dark, Fonts.size.h6, 'center')}>
            {'Resumen de tu servicio '}
          </Text>

          <Text
            style={Fonts.style.light(Colors.data, Fonts.size.small, 'center')}>
            {'Id de la orden'}{' '}
            <Text
              style={Fonts.style.bold(
                Colors.expert.primaryColor,
                Fonts.size.small,
                'center',
              )}>
              {filterOrder && filterOrder.cartId}
            </Text>
          </Text>
          <View opacity={0.0} style={ApplicationStyles.separatorLineMini} />

          <MapView
            pointerEvents={'none'}
            provider={PROVIDER_GOOGLE} // remove if not using Google Maps
            style={styles.mapView}
            customMapStyle={mapStyle}
            region={{
              latitude: filterOrder.address.coordinates?.latitude,
              longitude: filterOrder.address.coordinates?.longitude,
              latitudeDelta: 0.00002,
              longitudeDelta: 0.0002 * ASPECT_RATIO,
            }}>
            <Marker.Animated
              coordinate={{
                latitude: filterOrder.address.coordinates?.latitude,
                longitude: filterOrder.address.coordinates?.longitude,
              }}>
              <Icon
                name={'map-marker-alt'}
                size={30}
                color={Colors.client.primaryColor}
              />
            </Marker.Animated>
            {filterOrder.experts &&
              filterOrder.experts.length > 0 &&
              filterOrder.experts.map((item, index) => {
                return (
                  <Marker
                    key={index}
                    coordinate={{
                      latitude: item.coordinates?.latitude,
                      longitude: item.coordinates?.longitude,
                    }}>
                    <Icon
                      name={'map-marker-alt'}
                      size={30}
                      color={Colors.expert.primaryColor}
                    />
                  </Marker>
                );
              })}
          </MapView>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <TouchableOpacity
              onPress={() => handleMaps()}
              style={styles.btnMaps}>
              <Image
                source={Images.maps}
                style={{width: 20, height: 20, marginRight: 5}}
              />
              <Text
                style={[
                  Fonts.style.regular(Colors.dark, Fonts.size.medium),
                  {alignSelf: 'center'},
                ]}>
                Iniciar navegación
              </Text>
            </TouchableOpacity>
            <View
              style={{
                alignSelf: 'center',
                justifyContent: 'space-between',
                flexDirection: 'row',
                marginHorizontal: 20,
              }}>
              <TouchableOpacity
                style={{
                  backgroundColor: Colors.expert.primaryColor,
                  height: 40,
                  width: 40,
                  borderRadius: 20,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 10,
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 4,
                  },
                  shadowOpacity: 0.3,
                  shadowRadius: 4.65,

                  elevation: 8,
                }}
                onPress={() => handleWhatsapp()}>
                <Icon name={'phone-alt'} size={20} color={Colors.light} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={{marginTop: 10}}>
            <Text
              style={[
                Fonts.style.bold(
                  Colors.expert.primaryColor,
                  Fonts.size.medium,
                  'center',
                ),
                {marginVertical: 5},
              ]}>
              Información general
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginHorizontal: 20,
                marginVertical: 2.5,
              }}>
              <Text
                style={[
                  Fonts.style.regular(Colors.dark, Fonts.size.medium),
                  {flex: 1},
                ]}>
                Cliente:
              </Text>
              <Text
                style={[
                  Fonts.style.bold(Colors.dark, Fonts.size.medium),
                  {flex: 2},
                ]}>
                {filterOrder &&
                  filterOrder.client &&
                  `${filterOrder.client.firstName} ${filterOrder.client.lastName}`}
              </Text>
            </View>
            {/* <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginHorizontal: 20,
              }}>
              <Text
                style={[Fonts.style.regular(Colors.dark, Fonts.size.medium)]}>
                Teléfono:
              </Text>
              <Text style={[Fonts.style.bold(Colors.dark, Fonts.size.medium)]}>
                {filterOrder.client && filterOrder.client.phone}
              </Text>
            </View> */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginHorizontal: 20,
                marginVertical: 2.5,
              }}>
              <Text
                style={[
                  Fonts.style.regular(Colors.dark, Fonts.size.medium),
                  {flex: 1},
                ]}>
                Dirección:
              </Text>
              <Text
                style={[
                  Fonts.style.regular(Colors.dark, Fonts.size.medium),
                  {flex: 2},
                ]}>
                {filterOrder && filterOrder.address && filterOrder.address.name}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginHorizontal: 20,
                marginVertical: 2.5,
              }}>
              <Text
                style={[
                  Fonts.style.regular(Colors.dark, Fonts.size.medium, 'left'),
                  {flex: 1},
                ]}>
                Nota de{'\n'}servicio:
              </Text>
              <Text
                style={[
                  Fonts.style.regular(Colors.dark, Fonts.size.medium, 'left'),
                  {flex: 2},
                ]}>
                {filterOrder && filterOrder.address.notesAddress}
              </Text>
            </View>

            <View opacity={0.25} style={ApplicationStyles.separatorLine} />
            {filterOrder && services && services.length > 1 && (
              <>
                <Text
                  style={[
                    Fonts.style.bold(Colors.dark, Fonts.size.medium, 'left'),
                    {marginLeft: 20, marginBottom: 10},
                  ]}>
                  Selecciona tus servicios para ver al información
                </Text>
                <ScrollView
                  horizontal
                  contentContainerStyle={{paddingBottom: 40, marginLeft: 20}}>
                  {services.map((item, index) => {
                    return (
                      <Fragment key={index}>
                        {menuIndex === index ? (
                          <ButonMenu
                            item={item}
                            index={index}
                            menuIndex={menuIndex}
                            theme={true}
                            setMenuIndex={setMenuIndex}
                          />
                        ) : (
                          <ButonMenu
                            item={item}
                            index={index}
                            menuIndex={menuIndex}
                            theme={false}
                            setMenuIndex={setMenuIndex}
                          />
                        )}
                      </Fragment>
                    );
                  })}
                </ScrollView>
              </>
            )}
            {filterOrder &&
              services &&
              services.map((item, index) => {
                const {clients, addOnsCount, addons} = item;

                return (
                  <Fragment key={index}>
                    {menuIndex === index && (
                      <>
                        <Text
                          style={[
                            Fonts.style.bold(
                              Colors.expert.primaryColor,
                              Fonts.size.medium,
                              'center',
                            ),
                          ]}>
                          Servicios
                        </Text>
                        <View>
                          {clients.length > 0 &&
                            clients.map((guest, index) => {
                              const addonGuest = addons.filter(
                                (a) => a.guestId === guest.id,
                              );

                              return (
                                <Fragment key={index}>
                                  <View>
                                    <Text
                                      style={[
                                        Fonts.style.bold(
                                          Colors.dark,
                                          Fonts.size.medium,
                                          'left',
                                        ),
                                        {marginLeft: 20},
                                      ]}>
                                      {guest.firstName} {guest.lastName}
                                    </Text>
                                    <View
                                      style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                      }}>
                                      <Text
                                        style={[
                                          Fonts.style.regular(
                                            Colors.dark,
                                            Fonts.size.medium,
                                            'left',
                                          ),
                                          {
                                            marginLeft: 40,
                                            marginVertical: 5,
                                          },
                                        ]}>
                                        Servicio
                                      </Text>
                                      <Text
                                        style={[
                                          Fonts.style.regular(
                                            Colors.dark,
                                            Fonts.size.medium,
                                            'left',
                                          ),
                                          {
                                            marginRight: 20,
                                            marginVertical: 5,
                                          },
                                        ]}>
                                        {utilities.formatCOP(
                                          services[menuIndex].productPrice,
                                        )}
                                      </Text>
                                    </View>

                                    <View
                                      style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                      }}>
                                      {addonGuest.length > 0 &&
                                        addonGuest.map((item, index) => {
                                          return (
                                            <Fragment key={index}>
                                              <Text
                                                style={[
                                                  Fonts.style.regular(
                                                    Colors.dark,
                                                    Fonts.size.medium,
                                                    'left',
                                                  ),
                                                  {
                                                    marginLeft: 40,
                                                  },
                                                ]}>
                                                {item.addonName}
                                              </Text>
                                              <Text
                                                style={[
                                                  Fonts.style.regular(
                                                    Colors.dark,
                                                    Fonts.size.medium,
                                                    'left',
                                                  ),
                                                  {
                                                    marginRight: 20,
                                                  },
                                                ]}>
                                                {utilities.formatCOP(
                                                  item.addOnPrice,
                                                )}
                                              </Text>
                                            </Fragment>
                                          );
                                        })}
                                    </View>
                                  </View>
                                </Fragment>
                              );
                            })}
                        </View>

                        <View
                          opacity={0.25}
                          style={ApplicationStyles.separatorLine}
                        />

                        <Text
                          style={[
                            Fonts.style.bold(
                              Colors.expert.primaryColor,
                              Fonts.size.medium,
                              'center',
                            ),

                            {marginBottom: 10},
                          ]}>
                          Adicionales comunes
                        </Text>

                        {addOnsCount && addOnsCount.length > 0 ? (
                          addOnsCount.map((dataAddon, index) => {
                            const {name, count, addOnPrice} = dataAddon;

                            return (
                              <View key={index} style={styles.contAddons}>
                                <Text
                                  style={
                                    ([
                                      Fonts.style.regular(
                                        Colors.dark,
                                        Fonts.size.medium,
                                        'left',
                                      ),
                                    ],
                                    {flex: 2})
                                  }>
                                  {name} x{count}
                                </Text>
                                <Text
                                  style={
                                    ([
                                      Fonts.style.regular(
                                        Colors.dark,
                                        Fonts.size.medium,
                                      ),
                                    ],
                                    {
                                      flex: 1,
                                      textAlign: 'right',
                                      marginRight: 10,
                                    })
                                  }>
                                  {utilities.formatCOP(addOnPrice)}
                                </Text>
                              </View>
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
                            ]}>
                            Sin adiciones
                          </Text>
                        )}
                      </>
                    )}
                  </Fragment>
                );
              })}
            <View opacity={0.25} style={styles.separatorLineMini} />

            <Text
              style={[
                Fonts.style.bold(
                  Colors.expert.primaryColor,
                  Fonts.size.medium,
                  'center',
                ),
              ]}>
              Duración
            </Text>
            <Text
              style={[
                Fonts.style.regular(
                  Colors.expert.primaryColor,
                  Fonts.size.medium,
                  'center',
                ),
              ]}>
              {minToHours(services[menuIndex].duration)}
            </Text>
            <View opacity={0.25} style={styles.separatorLineMini} />

            <Text
              style={[
                Fonts.style.bold(
                  Colors.expert.primaryColor,
                  Fonts.size.medium,
                  'center',
                ),
              ]}>
              Resumen a cobrar
            </Text>
            {filterOrder &&
              services &&
              services.map((item, index) => {
                const {total, totalAddons, totalServices} = item;

                return (
                  <View key={index} style={styles.cont}>
                    {menuIndex === index && (
                      <>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginHorizontal: 20,
                            marginVertical: 2.5,
                          }}>
                          <Text
                            style={[
                              Fonts.style.regular(
                                Colors.dark,
                                Fonts.size.medium,
                              ),
                            ]}>
                            Subtotal
                          </Text>
                          <Text
                            style={[
                              Fonts.style.regular(
                                Colors.dark,
                                Fonts.size.medium,
                              ),
                            ]}>
                            {utilities.formatCOP(totalServices)}
                          </Text>
                        </View>

                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginHorizontal: 20,
                            marginVertical: 2.5,
                          }}>
                          <Text
                            style={[
                              Fonts.style.regular(
                                Colors.dark,
                                Fonts.size.medium,
                              ),
                            ]}>
                            Adicionales
                          </Text>
                          <Text
                            style={[
                              Fonts.style.regular(
                                Colors.dark,
                                Fonts.size.medium,
                              ),
                            ]}>
                            {utilities.formatCOP(totalAddons)}
                          </Text>
                        </View>

                        {filterOrder.coupon &&
                          filterOrder.coupon.type.includes(
                            item.servicesType,
                          ) && (
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                marginHorizontal: 20,
                                marginVertical: 2.5,
                              }}>
                              <Text
                                style={[
                                  Fonts.style.regular(
                                    Colors.dark,
                                    Fonts.size.medium,
                                  ),
                                ]}>
                                Descuento por cupón
                              </Text>
                              <Text
                                style={[
                                  Fonts.style.regular('red', Fonts.size.medium),
                                ]}>
                                -{' '}
                                {filterOrder.coupon?.typeCoupon === 'percentage'
                                  ? `${filterOrder.coupon?.percentage}%`
                                  : utilities.formatCOP(
                                      filterOrder.coupon?.money,
                                    )}
                              </Text>
                            </View>
                          )}
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginHorizontal: 20,
                            marginVertical: 2.5,
                          }}>
                          <Text
                            style={[
                              Fonts.style.bold(Colors.dark, Fonts.size.medium),
                            ]}>
                            Total a cobrar
                          </Text>

                          <Text
                            style={[
                              Fonts.style.bold(Colors.dark, Fonts.size.medium),
                            ]}>
                            {filterOrder.coupon &&
                            filterOrder.coupon.type.includes(item.servicesType)
                              ? filterOrder.coupon.typeCoupon !== 'money'
                                ? utilities.formatCOP(
                                    (filterOrder.coupon.percentage / 100) *
                                      total -
                                      total,
                                  )
                                : utilities.formatCOP(
                                    total - filterOrder.coupon?.money,
                                  )
                              : utilities.formatCOP(total)}
                          </Text>
                        </View>
                      </>
                    )}
                  </View>
                );
              })}
          </View>
        </ScrollView>

        {filterOrder &&
          filterOrder.services &&
          filterOrder.services.length > 0 &&
          filterOrder.services.map((item, index) => {
            return (
              <Fragment key={index}>
                {menuIndex === index && (
                  <>
                    {filterOrder && filterOrder.status <= 4 && !item.comment && (
                      <TouchableOpacity
                        onPress={() => changeStatus(item)}
                        style={styles.btnContainer}>
                        <Text
                          style={[
                            Fonts.style.bold(Colors.light, Fonts.size.medium),
                            {alignSelf: 'center'},
                          ]}>
                          {loading ? (
                            <ActivityIndicator color={Colors.light} />
                          ) : (
                            <Text
                              style={[
                                Fonts.style.bold(
                                  Colors.light,
                                  Fonts.size.medium,
                                ),
                                {alignSelf: 'center'},
                              ]}>
                              {getServiceStatus(item.status)}
                            </Text>
                          )}
                        </Text>
                      </TouchableOpacity>
                    )}

                    {item.status < 4 && (
                      <TouchableOpacity
                        onPress={() => activeModalEdit(item)}
                        style={{
                          width: Metrics.screenWidth * 0.5,
                          marginVertical: 5,
                          alignSelf: 'center',
                          borderRadius: Metrics.borderRadius,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Text
                          style={Fonts.style.regular(
                            Colors.dark,
                            Fonts.size.medium,
                            'center',
                            1,
                          )}>
                          Editar servicio
                        </Text>
                      </TouchableOpacity>
                    )}
                    <View style={{height: Metrics.addFooter + 2.5}} />
                  </>
                )}
              </Fragment>
            );
          })}
        {filterOrder?.services.length > 0 &&
          filterOrder.services[menuIndex].comment &&
          filterOrder.services[menuIndex].status === 4 && (
            <View
              style={{
                paddingVertical: 20,
                backgroundColor: Colors.expert.primaryColor,
              }}>
              <Text
                style={Fonts.style.bold(
                  Colors.light,
                  Fonts.size.medium,
                  'center',
                )}>
                Esperando que el cliente finalice el servicio
              </Text>
            </View>
          )}
        {filterOrder?.services.length > 0 &&
          filterOrder.services[menuIndex].status === 5 && (
            <View
              style={{
                paddingVertical: 20,
                backgroundColor: Colors.expert.primaryColor,
              }}>
              <Text
                style={Fonts.style.bold(
                  Colors.light,
                  Fonts.size.medium,
                  'center',
                )}>
                Esperando calificación
              </Text>
            </View>
          )}
        {filterOrder?.services.length > 0 &&
          filterOrder.services[menuIndex].status === 6 && (
            <View
              style={{
                paddingVertical: 20,
                backgroundColor: Colors.expert.primaryColor,
              }}>
              <Text
                style={Fonts.style.bold(
                  Colors.light,
                  Fonts.size.medium,
                  'center',
                )}>
                Servicio finalizado
              </Text>
            </View>
          )}
        {filterOrder?.services.length > 0 &&
          filterOrder.services[menuIndex].status === 7 && (
            <View
              style={{
                paddingVertical: 20,
                backgroundColor: Colors.expert.primaryColor,
              }}>
              <Text
                style={Fonts.style.bold(
                  Colors.light,
                  Fonts.size.medium,
                  'center',
                )}>
                Servicio cancelado
              </Text>
            </View>
          )}
        {filterOrder?.services.length > 0 &&
          filterOrder.services[menuIndex].status === 8 && (
            <View
              style={{
                paddingVertical: 20,
                backgroundColor: Colors.expert.primaryColor,
              }}>
              <Text
                style={Fonts.style.bold(
                  Colors.light,
                  Fonts.size.medium,
                  'center',
                )}>
                Servicio liquidado
              </Text>
            </View>
          )}
      </View>

      <ModalApp setOpen={setQualifyClient} open={qualifyClient}>
        <Qualify
          type="expert"
          userRef={filterOrder.client}
          ordersRef={filterOrder}
          close={setQualifyClient}
          menuIndex={menuIndex}
          validateStatusGlobal={validateStatusGlobal}
        />
      </ModalApp>
      <ModalApp setOpen={setModalEdit} open={modalEdit}>
        <ServiceModal
          close={close}
          order={filterOrder}
          itemService={itemService}
        />
      </ModalApp>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    height: Metrics.screenHeight - 40,
    paddingTop: 40,
  },
  mapView: {
    width: '100%',
    height: 200,
  },
  separatorLineMini: {
    width: Metrics.screenWidth * 0.9,
    alignSelf: 'center',
    height: 0.5,
    backgroundColor: Colors.dark,
    marginVertical: 20,
  },
  btnContainer: {
    width: Metrics.screenWidth * 0.5,
    height: 40,
    marginVertical: 10,
    alignSelf: 'center',
    borderRadius: Metrics.borderRadius,
    backgroundColor: Colors.expert.primaryColor,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  btnMaps: {
    flex: 1,
    height: 40,
    marginVertical: 10,
    marginHorizontal: 10,
    alignSelf: 'center',
    borderRadius: Metrics.borderRadius,
    backgroundColor: Colors.light,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,

    elevation: 7,
    flexDirection: 'row',
  },

  contAddons: {
    flexDirection: 'row',
    marginHorizontal: 10,
  },
});

export default DetailModal;
