import React, {Fragment, useContext, useEffect, useState} from 'react';
import {
  Text,
  StyleSheet,
  View,
  Dimensions,
  StatusBar,
  Alert,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import StepIndicator from 'react-native-step-indicator';
import moment from 'moment';
import {Colors, Metrics, Fonts} from '../../themes';
import {StoreContext} from '../../flux';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import Icon from 'react-native-vector-icons/FontAwesome5';
import ExpertCall from './Status/ExpertCall';
import Loading from '../../components/Loading';
import ModalApp from '../../components/ModalApp';
//import ButtonCoordinate from '../../components/ButtonCoordinate';
//import Geolocation from '@react-native-community/geolocation';
import {sendPushFcm, updateOrder, updateStatus} from '../../flux/util/actions';
import Qualify from '../../components/Qualify';
import {
  adddReferralsUser,
  updateProfile,
  validateReferrals,
} from '../../flux/auth/actions';
import ButonMenu from '../ButonMenu';
import utilities from '../../utilities';
import {customStyles} from './CustomStyles';
import Detail from './Detail';
import ModalCancel from './ModalCancel';
import MenuTab from './MenuTab';
import _ from 'lodash';

const OrderDetail = ({route, navigation}) => {
  /* config map */
  const screen = Dimensions.get('window');
  const ASPECT_RATIO = screen.width * 0.8 - 500 / screen.height;
  const mapStyle = require('../../config/mapStyle.json');

  const {params} = route;

  const {state, utilDispatch, authDispatch} = useContext(StoreContext);
  const {util, auth} = state;
  const {user} = auth;

  const {ordersAll} = util;
  const [orderUser, setOrderUser] = useState(null);
  const [modalQual, setModalQual] = useState(false);
  const [coordinate, setCoordinate] = useState(null);
  const [menuIndex, setMenuIndex] = useState(0);
  const [detail, setDetail] = useState(false);
  const [modalCancel, setModalCancel] = useState(false);

  const {goBack} = navigation;

  useEffect(() => {
    const currentOrder = ordersAll.filter((item) => item.id === params.id)[0]
      ? ordersAll.filter((item) => item.id === params.id)[0]
      : params;

    setOrderUser(currentOrder);
    setCoordinate({
      latitude: currentOrder.address.coordinates.latitude,
      longitude: currentOrder.address.coordinates.longitude,
    });
  }, [ordersAll, params]);

  // const activeCoor = () => {
  //Geolocation.getCurrentPosition((info) =>
  //setCoordinate({
  //latitude: info.coords.latitude,
  //longitude: info.coords.longitude,
  //}),
  //);
  //};
  const handleRef = async () => {
    let currentOrder = orderUser;
    currentOrder.services[menuIndex].status = 5;

    const guest = user.guestUser;
    if (guest && user.numberOfServices === 0) {
      const userGuest = await validateReferrals(guest.phone);
      const data = {
        firstName: userGuest.firstName,
        lastName: userGuest.lastName,
        email: userGuest.email,
        uid: userGuest.uid,
        used: false,
        createRef: moment().format('L'),
      };
      await adddReferralsUser(userGuest, data, authDispatch);
    }
    await updateProfile(
      user.numberOfServices + 1,
      'numberOfServices',
      authDispatch,
    );

    await updateOrder(currentOrder, utilDispatch);
    validateStatusGlobal();
  };
  const handleCancel = () => {
    if (orderUser.status >= 2) {
      return Alert.alert(
        'Ups',
        'Lo siento no puedes cancelar mientras el experto va en camino, por favor comunicate con soporte',
      );
    }
    if (orderUser.services[menuIndex].status >= 2) {
      return Alert.alert(
        'Ups',
        'Lo siento no puedes cancelar mientras el experto va en camino, por favor comunicate con soporte',
      );
    }
    if (orderUser.services.length === 1) {
      return Alert.alert(
        'Confirmación',
        '¿Realmente desea cancelar todos los servicios?',
        [
          {
            text: 'SI',
            onPress: async () => {
              let handleOrder = orderUser;
              handleOrder.services[menuIndex].status = 7;
              await updateOrder(handleOrder, utilDispatch);
              await updateStatus(7, orderUser, utilDispatch);
              let notification = {
                title: 'Servicio cancelado',
                body: `El client ${
                  user.firstName + ' ' + user.lastName
                } a cancelado el servicio de ${orderUser.services[
                  menuIndex
                ].servicesType
                  .toUpperCase()
                  .split('-')
                  .join(' ')}`,
                content_available: true,
                priority: 'high',
              };
              let dataPush = null;

              for (let index = 0; index < orderUser.fcmExpert.length; index++) {
                sendPushFcm(orderUser.fcmExpert[index], notification, dataPush);
              }
            },
          },
          {
            text: 'NO',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
        ],
        {cancelable: true},
      );
    }

    setModalCancel(true);
  };
  const validateStatusGlobal = async () => {
    let currentServices = orderUser.services;
    let currentOrder = orderUser;

    let orderServices = _.orderBy(currentServices, 'status', 'asc');

    currentOrder.status = orderServices[0].status;
    if (orderServices[0].status === 6) {
      currentOrder.timeLast = Date.now();
      currentOrder.timeLastCurrent = moment().format('DD/MM/Y');
    }

    await updateOrder(currentOrder, utilDispatch);
  };

  if (!orderUser) {
    return null;
  }
  return (
    <>
      <Loading type="client" />

      <StatusBar backgroundColor={Colors.light} barStyle={'dark-content'} />
      <View style={styles.container}>
        {orderUser ? (
          <>
            <View>
              {coordinate && (
                <>
                  {/* <View style={styles.contBtn}>
                    <ButtonCoordinate activeCoor={activeCoor} />
                  </View> */}

                  <MapView
                    pointerEvents={'none'}
                    provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                    style={styles.mapView}
                    customMapStyle={mapStyle}
                    region={{
                      latitude: coordinate.latitude,
                      longitude: coordinate.longitude,
                      latitudeDelta: 0.00005,
                      longitudeDelta: 0.0005 * ASPECT_RATIO,
                    }}>
                    {orderUser.experts &&
                      orderUser.experts.length > 0 &&
                      orderUser.experts.map((expert, index) => {
                        const {coordinates} = expert;
                        return (
                          <Fragment key={index}>
                            {coordinates && (
                              <Marker.Animated
                                coordinate={{
                                  latitude: coordinates.latitude,
                                  longitude: coordinates.longitude,
                                }}>
                                <Icon
                                  name={'map-marker-alt'}
                                  size={30}
                                  color={Colors.expert.primaryColor}
                                />
                              </Marker.Animated>
                            )}
                          </Fragment>
                        );
                      })}
                    <Marker.Animated
                      coordinate={{
                        latitude: orderUser.address.coordinates.latitude,
                        longitude: orderUser.address.coordinates.longitude,
                      }}>
                      <Icon
                        name={'map-marker-alt'}
                        size={30}
                        color={Colors.client.primaryColor}
                      />
                    </Marker.Animated>
                  </MapView>
                </>
              )}

              <View
                style={{
                  height: 40 + Metrics.addHeader,
                  paddingTop: Metrics.addHeader,
                  justifyContent: 'center',
                  zIndex: 2000,
                  position: 'absolute',
                  opacity: 0.8,
                }}>
                <TouchableOpacity onPress={() => goBack()}>
                  <View style={styles.containerBack}>
                    <Icon
                      name={'chevron-left'}
                      size={20}
                      color={Colors.dark}
                      style={{
                        alignSelf: 'center',
                      }}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            {orderUser &&
              orderUser.services &&
              orderUser.services.length > 0 &&
              orderUser.services.map((service, index) => {
                return (
                  <Fragment key={service.id}>
                    {menuIndex === index && (
                      <ExpertCall
                        experts={orderUser.experts}
                        uid={service.uid}
                        handleCancel={handleCancel}
                        status={orderUser.services[menuIndex].status}
                      />
                    )}
                  </Fragment>
                );
              })}

            <MenuTab setDetail={setDetail} detail={detail} />

            {!detail ? (
              <>
                <ScrollView>
                  <View
                    style={{
                      justifyContent: 'center',
                      backgroundColor: Colors.light,
                      marginLeft: 40,
                      marginVertical: 20,
                    }}>
                    <Text
                      numberOfLines={1}
                      style={Fonts.style.regular(
                        Colors.gray,
                        Fonts.size.medium,
                        'left',
                      )}>
                      Orden:{' '}
                      <Text
                        numberOfLines={1}
                        style={Fonts.style.bold(
                          Colors.expert.primaryColor,
                          Fonts.size.medium,
                          'center',
                        )}>
                        {orderUser.cartId}
                        {'\n'}
                      </Text>
                    </Text>
                    <Text
                      style={Fonts.style.regular(
                        Colors.dark,
                        Fonts.size.medium,
                        'left',
                      )}>
                      <Icon
                        name={'map-marker-alt'}
                        size={12}
                        color={Colors.expert.primaryColor}
                      />{' '}
                      Dirección: {orderUser.address.name}
                    </Text>
                    <Text
                      style={Fonts.style.regular(
                        Colors.dark,
                        Fonts.size.medium,
                        'left',
                      )}>
                      <Icon
                        name={'sticky-note'}
                        size={12}
                        color={Colors.expert.primaryColor}
                      />{' '}
                      Nota de dirección: {orderUser.address.notesAddress.trim()}
                      {'\n'}
                    </Text>

                    {orderUser &&
                      orderUser.hoursServices.length > 0 &&
                      orderUser.hoursServices.map((hour, index) => {
                        return (
                          <Fragment key={index}>
                            {menuIndex === index && (
                              <Text
                                style={Fonts.style.regular(
                                  Colors.dark,
                                  Fonts.size.medium,
                                  'left',
                                )}>
                                <Icon
                                  name={'calendar'}
                                  size={12}
                                  color={Colors.expert.primaryColor}
                                />{' '}
                                Hora del servicio: {hour}
                              </Text>
                            )}
                          </Fragment>
                        );
                      })}

                    {orderUser &&
                      orderUser.services &&
                      orderUser.services.length > 0 &&
                      orderUser.services.map((service, index) => {
                        return (
                          <Fragment key={index}>
                            {menuIndex === index && (
                              <>
                                <Text
                                  style={Fonts.style.regular(
                                    Colors.dark,
                                    Fonts.size.medium,
                                    'left',
                                  )}>
                                  <Icon
                                    name={'clock'}
                                    size={12}
                                    color={Colors.expert.primaryColor}
                                  />{' '}
                                  Duración del servicio: {service.duration} mins
                                  {'\n'}
                                </Text>
                                {orderUser.services[menuIndex]
                                  .commentClient && (
                                  <View>
                                    <Text
                                      style={Fonts.style.bold(
                                        Colors.expert.primaryColor,
                                        Fonts.size.medium,
                                        'left',
                                      )}>
                                      Calificación exitosa
                                    </Text>
                                    <Text
                                      style={Fonts.style.regular(
                                        Colors.dark,
                                        Fonts.size.medium,
                                        'left',
                                      )}>
                                      Tu calificación:{' '}
                                      {parseFloat(
                                        orderUser.services[menuIndex]
                                          .commentClient.rating,
                                      )}
                                    </Text>
                                    <Text
                                      style={Fonts.style.regular(
                                        Colors.dark,
                                        Fonts.size.medium,
                                        'left',
                                      )}>
                                      Tu nota:{' '}
                                      {
                                        orderUser.services[menuIndex]
                                          .commentClient.note
                                      }
                                      {'\n'}
                                    </Text>
                                  </View>
                                )}

                                <Text
                                  style={Fonts.style.regular(
                                    Colors.dark,
                                    Fonts.size.medium,
                                    'left',
                                  )}>
                                  <Icon
                                    name={'dollar-sign'}
                                    size={12}
                                    color={Colors.expert.primaryColor}
                                  />{' '}
                                  Sub Total:{' '}
                                  {utilities.formatCOP(service.totalServices)}
                                </Text>
                                <Text
                                  style={Fonts.style.regular(
                                    Colors.dark,
                                    Fonts.size.medium,
                                    'left',
                                  )}>
                                  <Icon
                                    name={'dollar-sign'}
                                    size={12}
                                    color={Colors.expert.primaryColor}
                                  />{' '}
                                  Total de adiciones:{' '}
                                  {utilities.formatCOP(service.totalAddons)}
                                </Text>
                                {orderUser.coupon &&
                                  orderUser.coupon.type.includes(
                                    service.servicesType,
                                  ) && (
                                    <>
                                      <Text
                                        style={Fonts.style.regular(
                                          'red',
                                          Fonts.size.medium,
                                          'left',
                                        )}>
                                        <Icon
                                          name={'tag'}
                                          size={12}
                                          color={'red'}
                                        />{' '}
                                        Descuento por cupón: -{' '}
                                        {orderUser.coupon?.typeCoupon ===
                                        'percentage'
                                          ? `${orderUser.coupon?.percentage}%`
                                          : utilities.formatCOP(
                                              orderUser.coupon?.money,
                                            )}
                                      </Text>
                                    </>
                                  )}
                                <Text
                                  style={Fonts.style.regular(
                                    Colors.dark,
                                    Fonts.size.medium,
                                    'left',
                                  )}>
                                  <Icon
                                    name={'dollar-sign'}
                                    size={12}
                                    color={Colors.expert.primaryColor}
                                  />{' '}
                                  Total del a pagar:{' '}
                                  {utilities.formatCOP(service.total)}
                                </Text>
                              </>
                            )}
                          </Fragment>
                        );
                      })}
                  </View>
                  {orderUser &&
                    orderUser.services &&
                    orderUser.services.length > 1 && (
                      <>
                        <ScrollView
                          horizontal
                          contentContainerStyle={{
                            marginHorizontal: 10,
                            paddingBottom: 20,
                          }}>
                          {orderUser.services.map((item, index) => {
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
                  {orderUser && orderUser.services[menuIndex].status > 4 && (
                    <View>
                      {orderUser.services[menuIndex].status === 7 && (
                        <Text
                          style={Fonts.style.bold(
                            Colors.dark,
                            Fonts.size.medium,
                            'center',
                          )}>
                          Cancelado
                        </Text>
                      )}
                      {orderUser.services[menuIndex].status === 6 && (
                        <Text
                          style={Fonts.style.bold(
                            Colors.dark,
                            Fonts.size.medium,
                            'center',
                          )}>
                          Finalizado con éxito
                        </Text>
                      )}
                      {orderUser.services[menuIndex].status === 8 && (
                        <Text
                          style={Fonts.style.bold(
                            Colors.dark,
                            Fonts.size.medium,
                            'center',
                          )}>
                          Finalizado con éxito
                        </Text>
                      )}
                    </View>
                  )}
                  {orderUser && orderUser.services[menuIndex].status < 4 && (
                    <View style={styles.cont}>
                      <View style={styles.step}>
                        <StepIndicator
                          customStyles={customStyles}
                          currentPosition={orderUser.services[menuIndex].status}
                          direction={'vertical'}
                          stepCount={5}
                          labels={[
                            'Buscando Experto',
                            'Preparando Orden',
                            'En ruta',
                            'En Servicio',
                            'Completado',
                          ]}
                        />
                      </View>
                    </View>
                  )}
                </ScrollView>
              </>
            ) : (
              <>
                <Detail
                  filterOrder={orderUser}
                  setMenuIndex={setMenuIndex}
                  menuIndex={menuIndex}
                />
              </>
            )}

            <ModalApp setOpen={setModalQual} open={modalQual}>
              <Qualify
                type="client"
                userRef={orderUser.experts[menuIndex]}
                ordersRef={orderUser}
                close={setModalQual}
                updateStatus={updateStatus}
                menuIndex={menuIndex}
                validateStatusGlobal={validateStatusGlobal}
              />
            </ModalApp>
          </>
        ) : (
          <Loading type={'client'} />
        )}
      </View>
      <View
        style={{
          backgroundColor: Colors.light,
          width: Metrics.screenWidth,
        }}>
        <View>
          {orderUser && orderUser.services[menuIndex].status === 4 && (
            <TouchableOpacity
              style={styles.btn}
              onPress={() =>
                Alert.alert(
                  'Hey',
                  '¿Estas seguro(a) que deseas completar esta orden?',
                  [
                    {
                      text: 'SI',
                      onPress: async () => {
                        handleRef();
                      },
                    },

                    {
                      text: 'Cancelar',
                      onPress: () => console.log('Cancel Pressed'),
                      style: 'cancel',
                    },
                  ],
                  {cancelable: true},
                )
              }>
              <Text
                style={Fonts.style.bold(
                  Colors.light,
                  Fonts.size.medium,
                  'center',
                )}>
                Finalizar servicio
              </Text>
            </TouchableOpacity>
          )}

          {orderUser && orderUser.services[menuIndex].status === 5 && (
            <>
              <TouchableOpacity
                style={[styles.btn]}
                onPress={() => setModalQual(true)}>
                <Text
                  style={Fonts.style.bold(
                    Colors.light,
                    Fonts.size.medium,
                    'center',
                  )}>
                  Calificar servicio
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      <ModalApp setOpen={setModalCancel} open={modalCancel}>
        <ModalCancel
          close={setModalCancel}
          service={
            orderUser && orderUser.services && orderUser.services[menuIndex]
          }
          order={orderUser}
          dispatch={utilDispatch}
          menuIndex={menuIndex}
          user={user}
        />
      </ModalApp>
    </>
  );
};
const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.light},
  cont: {
    flex: 1,
    backgroundColor: Colors.light,
  },
  step: {
    width: Metrics.screenWidth,
    height: Metrics.screenHeight / 4,
    marginLeft: 20,
  },

  mapView: {
    height: Metrics.screenHeight / 6,
    width: '100%',
    zIndex: 1,
  },

  containerBack: {
    marginLeft: 20,
    backgroundColor: 'white',
    height: 30,
    width: 30,
    flex: 0,
    borderRadius: 15,
    justifyContent: 'center',
    marginTop: 20,
  },

  btn: {
    backgroundColor: Colors.expert.primaryColor,
    width: Metrics.screenWidth - 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    zIndex: 2,
    alignSelf: 'center',
  },
});

export default OrderDetail;
