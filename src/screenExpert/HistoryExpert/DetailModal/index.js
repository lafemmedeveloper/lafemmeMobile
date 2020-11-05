import React, {Fragment, useState, useContext, useEffect} from 'react';
import {
  Text,
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
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
import {updateStatus} from '../../../flux/util/actions';
import Loading from '../../../components/Loading';
import {StoreContext} from '../../../flux';
import ModalApp from '../../../components/ModalApp';
import Qualify from '../../../components/Qualify';
import ServiceModal from './ServiceModal';
import ButonMenu from '../../../screen/ButonMenu';

const DetailModal = ({order, modeHistory, setModalDetail}) => {
  const screen = Dimensions.get('window');
  const {state, utilDispatch} = useContext(StoreContext);
  const {util, auth} = state;
  const {user} = auth;
  const {expertOpenOrders, expertHistoryOrders, loading} = util;

  const mapStyle = require('../../../config/mapStyle.json');

  const dataOrder = !expertOpenOrders.filter((o) => o.id === order.id)[0]
    ? expertHistoryOrders.filter((o) => o.id === order.id)[0] || order
    : expertOpenOrders.filter((o) => o.id === order.id)[0];

  const filterOrder = dataOrder ? dataOrder : order;
  const {client, services, cartId, address} = filterOrder;

  const ASPECT_RATIO = screen.width * 0.8 - 500 / screen.height;

  const [qualifyClient, setQualifyClient] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [serviceFilter, setServiceFilter] = useState([]);

  const onRut = async () => {
    let resulTime = utilities.counting(filterOrder.date);

    if (resulTime.remainHours > 1) {
      Alert.alert('Ups', 'Lo siento aun falta mas de una hora para esta orden');
    } else {
      const status = 2;
      updateStatus(status, filterOrder, utilDispatch);
    }
  };

  const changeStatus = (status) => {
    if (filterOrder.status === 1) {
      Alert.alert(
        'Hola',
        'Estas seguro(a) que quieres cambiar de estado.',
        [
          {
            text: 'Si',
            onPress: () => {
              onRut(status);
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
    } else if (filterOrder.status === 2) {
      const status = 3;

      Alert.alert(
        'Hola',
        'Estas seguro(a) que quieres cambiar de estado.',
        [
          {
            text: 'Si',
            onPress: () => {
              updateStatus(status, filterOrder, utilDispatch);
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
    } else if (filterOrder.status === 3) {
      const status = 4;

      Alert.alert(
        'Hola',
        'Estas seguro(a) que quieres cambiar de estado.',
        [
          {
            text: 'Si',
            onPress: () => {
              addServiceClient(status);
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
    } else if (filterOrder.status === 4) {
      const status = 5;

      Alert.alert(
        'Hola',
        'Estas seguro(a) que quieres cambiar de estado.',
        [
          {
            text: 'Si',
            onPress: () => {
              updateStatus(status, filterOrder, utilDispatch);
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
    }
  };
  const addServiceClient = async (status) => {
    await updateStatus(status, filterOrder, utilDispatch);
  };
  const close = () => {
    setModalEdit(false);
    setModalDetail(false);
  };

  useEffect(() => {
    setServiceFilter(filterOrder.services.filter((s) => s.uid === user.uid));
  }, [filterOrder.services, user.uid]);

  console.log(
    'service filter =>',
    filterOrder.services.filter((s) => s.uid === user.uid),
  );

  return (
    <>
      <Loading type={'expert'} loading={loading} />

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
            {cartId}
          </Text>
        </Text>
        <View opacity={0.0} style={ApplicationStyles.separatorLineMini} />

        {services && services.length > 1 && (
          <ScrollView horizontal style={{marginLeft: 20}}>
            {services.map((item) => {
              return (
                <Fragment key={item.id}>
                  <ButonMenu item={item} />
                </Fragment>
              );
            })}
          </ScrollView>
        )}
        <ButonMenu />

        <ScrollView style={{marginTop: 20}}>
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
                {`${client.firstName} ${client.lastName}`}
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
                {client.phone}
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
                Direccion
              </Text>
              <Text
                style={[Fonts.style.regular(Colors.dark, Fonts.size.medium)]}>
                {address.name}
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
                {address.notesAddress}
              </Text>
            </View>

            <View opacity={0.25} style={ApplicationStyles.separatorLine} />

            {services &&
              services.map((item, index) => {
                const {name, clients, addOnsCount, addons} = item;

                return (
                  <Fragment key={index}>
                    {false && filterOrder.status < 4 && (
                      <View style={styles.contEdit}>
                        <TouchableOpacity
                          style={styles.btnEdit}
                          onPress={() => setModalEdit(true)}>
                          <Icon
                            name={'edit'}
                            size={20}
                            color={Colors.expert.primaryColor}
                          />
                        </TouchableOpacity>
                      </View>
                    )}

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
                          Fonts.style.regular(Colors.dark, Fonts.size.medium),
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
                          Fonts.style.regular(Colors.dark, Fonts.size.medium),
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
            {services &&
              services.map((item, index) => {
                const {duration, total, totalAddons, totalServices} = item;

                return (
                  <View key={index} style={styles.cont}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginHorizontal: 20,
                      }}>
                      <Text
                        style={[
                          Fonts.style.regular(Colors.dark, Fonts.size.medium),
                        ]}>
                        DURACION{' '}
                      </Text>
                      <Text
                        style={[
                          Fonts.style.regular(Colors.dark, Fonts.size.medium),
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
                          Fonts.style.regular(Colors.dark, Fonts.size.medium),
                        ]}>
                        SUBTOTAL
                      </Text>
                      <Text
                        style={[
                          Fonts.style.regular(Colors.dark, Fonts.size.medium),
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
                          Fonts.style.regular(Colors.dark, Fonts.size.medium),
                        ]}>
                        ADICIONES
                      </Text>
                      <Text
                        style={[
                          Fonts.style.regular(Colors.dark, Fonts.size.medium),
                        ]}>
                        {utilities.formatCOP(totalAddons)}
                      </Text>
                    </View>

                    {filterOrder && filterOrder.coupon && (
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          marginHorizontal: 20,
                        }}>
                        <Text
                          style={[
                            Fonts.style.regular(Colors.dark, Fonts.size.medium),
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
                            : utilities.formatCOP(filterOrder.coupon?.money)}
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
                        {filterOrder.coupon
                          ? filterOrder.coupon.typeCoupon !== 'money'
                            ? utilities.formatCOP(
                                (filterOrder.coupon.percentage / 100) * total -
                                  total,
                              )
                            : utilities.formatCOP(
                                total - filterOrder.coupon?.money,
                              )
                          : utilities.formatCOP(total)}
                      </Text>
                    </View>
                  </View>
                );
              })}
          </View>
        </ScrollView>
        {filterOrder.status === 1 && (
          <TouchableOpacity
            onPress={() => changeStatus(2)}
            style={[styles.btnContainer]}>
            <Text
              style={[
                Fonts.style.bold(Colors.light, Fonts.size.medium),
                {alignSelf: 'center'},
              ]}>
              Colocarme en ruta
            </Text>
          </TouchableOpacity>
        )}
        {filterOrder.status === 2 && (
          <TouchableOpacity
            onPress={() => changeStatus(3)}
            style={[styles.btnContainer]}>
            <Text
              style={[
                Fonts.style.bold(Colors.light, Fonts.size.medium),
                {alignSelf: 'center'},
              ]}>
              Colocarme en servicio
            </Text>
          </TouchableOpacity>
        )}
        {filterOrder.status === 3 && (
          <TouchableOpacity
            onPress={() => changeStatus(4)}
            style={[styles.btnContainer]}>
            <Text
              style={[
                Fonts.style.bold(Colors.light, Fonts.size.medium),
                {alignSelf: 'center'},
              ]}>
              Finalizando servicio
            </Text>
          </TouchableOpacity>
        )}
        {filterOrder.status >= 4 && filterOrder.qualtificationClient === '' && (
          <TouchableOpacity
            onPress={() => setQualifyClient(true)}
            style={[styles.btnContainer]}>
            <Text
              style={[
                Fonts.style.bold(Colors.light, Fonts.size.medium),
                {alignSelf: 'center'},
              ]}>
              Calificar cliente
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <ModalApp setOpen={setQualifyClient} open={qualifyClient}>
        <Qualify
          type="expert"
          userRef={filterOrder.client}
          ordersRef={filterOrder}
          close={setQualifyClient}
          typeQualification={'qualtificationClient'}
        />
      </ModalApp>
      <ModalApp setOpen={setModalEdit} open={modalEdit}>
        <ServiceModal close={close} order={filterOrder} />
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
    paddingVertical: 20,
  },
  btnEdit: {
    zIndex: 10,
    backgroundColor: Colors.light,
    height: 50,
    width: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,

    elevation: 8,
  },
  contEdit: {
    alignSelf: 'flex-end',
    right: 20,
    position: 'absolute',
    top: -30,
  },
  contAddons: {
    flexDirection: 'row',
  },
});

export default DetailModal;
