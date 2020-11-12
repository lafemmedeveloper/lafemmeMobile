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
import MapView, {Marker} from 'react-native-maps';
import Icon from 'react-native-vector-icons/FontAwesome5';
import ExpertCall from './Status/ExpertCall';
import Loading from '../../components/Loading';
import ModalApp from '../../components/ModalApp';
import ButtonCoordinate from '../../components/ButtonCoordinate';
import Geolocation from '@react-native-community/geolocation';
import {updateStatus} from '../../flux/util/actions';
import Qualify from '../../components/Qualify';
import {
  adddReferralsUser,
  updateProfile,
  validateReferrals,
} from '../../flux/auth/actions';
import ButonMenu from '../ButonMenu';
import utilities from '../../utilities';
import {customStyles} from './CustomStyles';

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

  const {goBack} = navigation;

  useEffect(() => {
    const currentOrder = ordersAll.filter((item) => item.id === params.id)[0];

    setOrderUser(currentOrder);
    setCoordinate({
      latitude: currentOrder.address.coordinates.latitude,
      longitude: currentOrder.address.coordinates.longitude,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ordersAll]);

  const activeCoor = () => {
    Geolocation.getCurrentPosition((info) =>
      setCoordinate({
        latitude: info.coords.latitude,
        longitude: info.coords.longitude,
      }),
    );
  };
  const handleRef = async () => {
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

    await updateStatus(5, orderUser, utilDispatch);
  };

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
                  <View style={styles.contBtn}>
                    <ButtonCoordinate activeCoor={activeCoor} />
                  </View>
                  <View style={styles.contBtnC}>
                    <TouchableOpacity
                      onPress={() =>
                        Alert.alert(
                          '¡HEY!',
                          'Realmente deseas cancelar esta orden',
                          [
                            {
                              text: 'SI CANCELAR',
                              onPress: () => {
                                updateStatus(7, orderUser, utilDispatch);
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
                          Colors.client.primaryColor,
                          Fonts.size.medium,
                        )}>
                        Cancelar
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <MapView
                    pointerEvents={'none'}
                    // provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                    style={styles.mapView}
                    customMapStyle={mapStyle}
                    region={{
                      latitude: coordinate.latitude,
                      longitude: coordinate.longitude,
                      latitudeDelta: 0.00002,
                      longitudeDelta: 0.0002 * ASPECT_RATIO,
                    }}>
                    {orderUser.experts &&
                      orderUser.experts.length > 0 &&
                      orderUser.experts.map((expert) => {
                        const {coordinates} = expert;
                        return (
                          <Fragment key={expert.uid}>
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
                      />
                    )}
                  </Fragment>
                );
              })}
            <View>
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
                  {orderUser.address.name}
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
                            {hour}
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
                              {service.duration} mins
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
                                    -{' '}
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
                                name={'coins'}
                                size={12}
                                color={Colors.expert.primaryColor}
                              />{' '}
                              {utilities.formatCOP(service.total)}
                            </Text>
                          </>
                        )}
                      </Fragment>
                    );
                  })}
              </View>
              {orderUser.services && orderUser.services.length > 1 && (
                <>
                  <ScrollView
                    horizontal
                    style={{
                      marginBottom: 10,
                      marginHorizontal: 10,
                      paddingVertical: 10,
                    }}>
                    {orderUser.services.map((item, index) => {
                      return (
                        <Fragment key={item.id}>
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
              <View style={styles.cont}>
                {orderUser.services &&
                  orderUser.services.length > 0 &&
                  orderUser.services.map((service, index) => {
                    return (
                      menuIndex === index && (
                        <View style={styles.step}>
                          <StepIndicator
                            customStyles={customStyles}
                            currentPosition={service.status}
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
                      )
                    );
                  })}
              </View>
            </View>
            <ModalApp setOpen={setModalQual} open={modalQual}>
              <Qualify
                type="expert"
                userRef={orderUser.experts}
                ordersRef={orderUser}
                close={setModalQual}
                typeQualification={'qualtificationExpert'}
                updateStatus={updateStatus}
              />
            </ModalApp>
          </>
        ) : (
          <Loading type={'client'} />
        )}
      </View>
      <View style={{backgroundColor: Colors.light, width: '100%'}}>
        <View>
          {orderUser && orderUser.status === 4 && (
            <TouchableOpacity
              style={styles.btn}
              onPress={() =>
                Alert.alert(
                  'Hey',
                  'Estas seguro(a) que deseas cambiar de estado ?',
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
                Completar orden
              </Text>
            </TouchableOpacity>
          )}

          {orderUser && orderUser.status === 5 && (
            <>
              <TouchableOpacity
                style={styles.btn}
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
          <TouchableOpacity
            onPress={() => console.log('call soport')}
            style={{
              width: Metrics.screenWidth,
              paddingVertical: 20,
              alignContent: 'center',
              justifyContent: 'center',

              backgroundColor: Colors.light,
              zIndex: 2,
              height: 20,
              marginTop: 30,
            }}>
            <Text
              style={Fonts.style.underline(
                Colors.dark,
                Fonts.size.medium,
                'center',
              )}>
              Contactar a soporte
            </Text>
          </TouchableOpacity>
        </View>
      </View>
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
  contBtn: {
    position: 'absolute',
    width: '100%',
    zIndex: 2,
    bottom: 10,
    right: 20,
    alignItems: 'flex-end',
  },
  contBtnC: {
    position: 'absolute',
    width: '100%',
    zIndex: 3,
    top: 20,
    right: 20,
    alignItems: 'flex-end',
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
