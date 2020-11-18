import React, {Fragment, useState, useContext} from 'react';
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
import {
  sendPushFcm,
  updateOrder,
  updateStatusDb, // updateStatus
} from '../../../flux/util/actions';
import Loading from '../../../components/Loading';
import {StoreContext} from '../../../flux';
import ModalApp from '../../../components/ModalApp';
import Qualify from '../../../components/Qualify';
import ServiceModal from './ServiceModal';
import ButonMenu from '../../../screen/ButonMenu';

const DetailModal = ({order, setModalDetail}) => {
  const screen = Dimensions.get('window');
  const {state, utilDispatch} = useContext(StoreContext);
  const {util, auth} = state;
  const {user} = auth;
  const {ordersAll, loading} = util;

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
      case 7:
        return 'Servicio cancelado';
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
              let resulTime = utilities.counting(filterOrder.date);
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
                validateStatusGlobal(2);
                if (currentOrder.services.length === 1) {
                  currentOrder.status = 2;
                  await updateOrder(filterOrder, utilDispatch);
                }
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
              const status = 3;

              let currentOrder = filterOrder;
              let indexService = filterOrder.services.findIndex(
                (s) => s.id === item.id,
              );
              currentOrder.services[indexService].status = 3;

              await updateOrder(filterOrder, utilDispatch);
              validateStatusGlobal(status);
              if (currentOrder.services.length === 1) {
                currentOrder.status = 3;
                await updateOrder(filterOrder, utilDispatch);
              }

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
      const status = 4;

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
              validateStatusGlobal(status);
              if (currentOrder.services.length === 1) {
                currentOrder.status = 4;
                await updateOrder(filterOrder, utilDispatch);
              }
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
  if (!filterOrder) {
    return <Loading type={'expert'} loading={loading} />;
  }
  const validateStatusGlobal = async (status) => {
    console.log('active global status');
    let updateOrder = false;

    for (let i = 0; i < filterOrder.services.length; i++) {
      if (filterOrder.services[i].status < 4) {
        updateOrder = false;
      } else if (filterOrder.services[i].status >= 4) {
        updateOrder = true;
      }
    }

    if (updateOrder) {
      await updateStatusDb(filterOrder, status, utilDispatch);
    }
  };

  return (
    <>
      <View style={styles.container}>
        <View opacity={0.0} style={ApplicationStyles.separatorLineMini} />

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

        <ScrollView style={{}}>
          <TouchableOpacity onPress={() => console.log('ir map')}>
            {false && (
              <MapView
                pointerEvents={'none'}
                provider={__DEV__ ? null : PROVIDER_GOOGLE} // remove if not using Google Maps
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
                  filterOrder.experts.map((item) => {
                    return (
                      <Marker
                        key={item.uid}
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
            )}
          </TouchableOpacity>

          <View style={{marginTop: 20}}>
            <Text
              style={[
                Fonts.style.bold(
                  Colors.expert.primaryColor,
                  Fonts.size.medium,
                  'center',
                ),
              ]}>
              Clientes
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginHorizontal: 20,
              }}>
              <Text
                style={[Fonts.style.regular(Colors.dark, Fonts.size.medium)]}>
                Cliente
              </Text>
              <Text style={[Fonts.style.bold(Colors.dark, Fonts.size.medium)]}>
                {filterOrder &&
                  filterOrder.client &&
                  `${filterOrder.client.firstName} ${filterOrder.client.lastName}`}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginHorizontal: 20,
              }}>
              <Text
                style={[Fonts.style.regular(Colors.dark, Fonts.size.medium)]}>
                Teléfono
              </Text>
              <Text style={[Fonts.style.bold(Colors.dark, Fonts.size.medium)]}>
                {filterOrder.client && filterOrder.client.phone}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginHorizontal: 20,
              }}>
              <Text
                style={[Fonts.style.regular(Colors.dark, Fonts.size.medium)]}>
                Dirección
              </Text>
              <Text
                style={[Fonts.style.regular(Colors.dark, Fonts.size.medium)]}>
                {filterOrder && filterOrder.address && filterOrder.address.name}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginHorizontal: 20,
              }}>
              <Text
                style={[
                  Fonts.style.regular(Colors.dark, Fonts.size.medium, 'left'),
                ]}>
                Nota de entrega
              </Text>
              <Text
                style={[
                  Fonts.style.regular(Colors.dark, Fonts.size.medium, 'left'),
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
            {filterOrder &&
              services &&
              services.map((item, index) => {
                const {name, clients, addOnsCount, addons} = item;

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
                          Productos
                        </Text>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginHorizontal: 20,
                          }}>
                          <Text
                            style={[
                              Fonts.style.regular(
                                Colors.dark,
                                Fonts.size.medium,
                              ),
                            ]}>
                            Producto
                          </Text>
                          <Text
                            style={[
                              Fonts.style.bold(Colors.dark, Fonts.size.medium),
                            ]}>
                            {name}
                          </Text>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginHorizontal: 20,
                          }}>
                          <Text
                            style={[
                              Fonts.style.regular(
                                Colors.dark,
                                Fonts.size.medium,
                              ),
                            ]}>
                            Invitados
                          </Text>

                          <Text
                            style={[
                              Fonts.style.bold(
                                Colors.dark,
                                Fonts.size.medium,
                                'left',
                              ),
                              {marginLeft: 20},
                            ]}>
                            {clients.length === 0 ? 'Ninguno' : clients.length}
                          </Text>
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
                          ]}>
                          Adicionales comunes
                        </Text>
                        {addons && addons.length > 0 ? (
                          addons.map((dataAddon, index) => {
                            const {addonName} = dataAddon;

                            return (
                              <View key={index} style={styles.contAddons}>
                                <Text
                                  style={[
                                    Fonts.style.regular(
                                      Colors.dark,
                                      Fonts.size.medium,
                                      'left',
                                    ),
                                    {marginLeft: 20},
                                  ]}>
                                  {addonName}{' '}
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
                            No ahi adiciones comunes
                          </Text>
                        )}
                        <View opacity={0.25} style={styles.separatorLineMini} />
                        <Text
                          style={[
                            Fonts.style.bold(
                              Colors.expert.primaryColor,
                              Fonts.size.medium,
                              'center',
                            ),
                          ]}>
                          Adicionales contable
                        </Text>
                        {addOnsCount.length > 0 ? (
                          addOnsCount.map((addonCount, index) => {
                            const {name, count} = addonCount;
                            return (
                              <Fragment key={index}>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginHorizontal: 20,
                                  }}>
                                  <Text
                                    style={[
                                      Fonts.style.regular(
                                        Colors.dark,
                                        Fonts.size.medium,
                                        'left',
                                      ),
                                      {marginLeft: 20},
                                    ]}>
                                    {name}
                                  </Text>
                                  <Text
                                    style={[
                                      Fonts.style.bold(
                                        Colors.dark,
                                        Fonts.size.medium,
                                      ),
                                    ]}>
                                    X{' '}
                                    <Text
                                      style={[
                                        Fonts.style.regular(
                                          Colors.dark,
                                          Fonts.size.medium,
                                        ),
                                      ]}>
                                      {count}
                                    </Text>
                                  </Text>
                                </View>
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
                            ]}>
                            No ahi adiciones Contables
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
              Resumen a cobrar
            </Text>
            {filterOrder &&
              services &&
              services.map((item, index) => {
                const {duration, total, totalAddons, totalServices} = item;

                return (
                  <View key={index} style={styles.cont}>
                    {menuIndex === index && (
                      <>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginHorizontal: 20,
                          }}>
                          <Text
                            style={[
                              Fonts.style.regular(
                                Colors.dark,
                                Fonts.size.medium,
                              ),
                            ]}>
                            DURACIÓN{' '}
                          </Text>
                          <Text
                            style={[
                              Fonts.style.regular(
                                Colors.dark,
                                Fonts.size.medium,
                              ),
                            ]}>
                            {duration} mins
                          </Text>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginHorizontal: 20,
                          }}>
                          <Text
                            style={[
                              Fonts.style.regular(
                                Colors.dark,
                                Fonts.size.medium,
                              ),
                            ]}>
                            SUBTOTAL
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
                          }}>
                          <Text
                            style={[
                              Fonts.style.regular(
                                Colors.dark,
                                Fonts.size.medium,
                              ),
                            ]}>
                            ADICIONES
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
                              }}>
                              <Text
                                style={[
                                  Fonts.style.regular(
                                    Colors.dark,
                                    Fonts.size.medium,
                                  ),
                                ]}>
                                DESCUENTO POR CUPÓN
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
                          }}>
                          <Text
                            style={[
                              Fonts.style.bold(Colors.dark, Fonts.size.medium),
                            ]}>
                            TOTAL DE SERVICIOS
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
          services &&
          services.length > 0 &&
          services.map((item, index) => {
            return (
              <Fragment key={item.id}>
                {menuIndex === index && (
                  <>
                    {filterOrder && filterOrder.status <= 4 && (
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
                          marginVertical: 10,
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
                    <View style={{height: Metrics.addFooter + 10}} />
                  </>
                )}
              </Fragment>
            );
          })}
      </View>

      <ModalApp setOpen={setQualifyClient} open={qualifyClient}>
        <Qualify
          type="expert"
          userRef={filterOrder.client}
          ordersRef={filterOrder}
          close={setQualifyClient}
          typeQualification={'qualtificationClient'}
          menuIndex={menuIndex}
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
    height: Metrics.screenHeight - 80,
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

  contAddons: {
    flexDirection: 'row',
  },
});

export default DetailModal;
