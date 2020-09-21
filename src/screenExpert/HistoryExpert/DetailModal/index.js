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
import utilities from '../../../utilities';
import {setLoading} from '../../../flux/util/actions';
import Loading from '../../../components/Loading';
import {StoreContext} from '../../../flux';
import firestore from '@react-native-firebase/firestore';

const DetailModal = (props) => {
  const {state, utilDispatch} = useContext(StoreContext);
  const {util} = state;
  const {loading} = util;

  const mapStyle = require('../../../config/mapStyle.json');

  const {order, setModalDetail} = props;
  const {client, services, cartId} = order;
  const {address} = order;

  const screen = Dimensions.get('window');
  const ASPECT_RATIO = screen.width * 0.8 - 500 / screen.height;

  useEffect(() => {
    countdown(order.date);
  }, []);

  const [dateCount, setDateCount] = useState('');
  const [activeStatus, setActiveStatus] = useState(false);

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

  const onRut = async (number) => {
    console.log('status ==>', number);
    if (!activeStatus) {
      Alert.alert('Ups', `Aun faltan : ${dateCount} para continuar`);
    } else {
      try {
        setLoading(true, utilDispatch);
        const ref = firestore().collection('orders').doc(order.id);
        await ref.set(
          {
            status: number,
          },
          {merge: true},
        );

        setLoading(false, utilDispatch);

        setModalDetail(false);
      } catch (error) {
        setLoading(false, utilDispatch);

        console.log('error onRut', error);
      }
    }
  };

  const changeStatus = (status) => {
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
  };

  return (
    <>
      <Loading type={'expert'} loading={loading} />

      <View style={styles.container}>
        <Icon
          name={'running'}
          size={30}
          color={Colors.expert.primaryColor}
          style={{alignSelf: 'center'}}
        />
        <Text style={Fonts.style.bold(Colors.dark, Fonts.size.h6, 'center')}>
          {'Resumen de la Ordén'}{' '}
          <Text
            style={[
              Fonts.style.bold(
                Colors.expert.primaryColor,
                Fonts.size.h6,
                'center',
              ),
            ]}>
            {cartId}
          </Text>
        </Text>
        {/*    <View style={styles.contButtonMap}>
          <ButtonMaps goLocation={sendLocation} />
        </View> */}

        <ScrollView style={{marginTop: 20}}>
          <TouchableOpacity onPress={() => console.log('ir map')}>
            <MapView
              pointerEvents={'none'}
              provider={PROVIDER_GOOGLE} // remove if not using Google Maps
              style={styles.mapView}
              customMapStyle={mapStyle}
              region={{
                latitude: order.address.coordinates.latitude,
                longitude: order.address.coordinates.longitude,
                latitudeDelta: 0.00002,
                longitudeDelta: 0.0002 * ASPECT_RATIO,
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
          </TouchableOpacity>
          <View style={{marginTop: 20}}>
            <Text
              style={[
                Fonts.style.bold(Colors.dark, Fonts.size.medium, 'left'),
                {marginLeft: 20},
              ]}>
              Dirección de entrega
            </Text>
            <Text
              style={[
                Fonts.style.regular(Colors.dark, Fonts.size.medium, 'left'),
                {marginLeft: 20},
              ]}>
              {address.name}
            </Text>
            <Text
              style={[
                Fonts.style.bold(Colors.dark, Fonts.size.medium, 'left'),
                {marginLeft: 20},
              ]}>
              Nota de entrega
            </Text>
            <Text
              style={[
                Fonts.style.regular(Colors.dark, Fonts.size.medium, 'left'),
                {marginLeft: 20},
              ]}>
              {address.notesAddress}
            </Text>
            <View opacity={0.25} style={styles.separatorLineMini} />

            <Text
              style={[
                Fonts.style.bold(Colors.dark, Fonts.size.medium, 'left'),
                {marginLeft: 20},
              ]}>
              Cliente
            </Text>
            <Text
              style={[
                Fonts.style.regular(Colors.dark, Fonts.size.medium, 'left'),
                {marginLeft: 20},
              ]}>
              {`${client.firstName} ${client.lastName}`}
            </Text>
            <Text
              style={[
                Fonts.style.bold(Colors.dark, Fonts.size.medium, 'left'),
                {marginLeft: 20},
              ]}>
              Télefono
            </Text>
            <Text
              style={[
                Fonts.style.regular(Colors.dark, Fonts.size.medium, 'left'),
                {marginLeft: 20},
              ]}>
              {client.phone}
            </Text>
            <View opacity={0.25} style={ApplicationStyles.separatorLine} />

            {services &&
              services.map((item, index) => {
                const {name, clients, addOnsCount, addons} = item;
                console.log('addons =========>', addons);

                return (
                  <Fragment key={index}>
                    <Text
                      style={[
                        Fonts.style.bold(
                          Colors.dark,
                          Fonts.size.medium,
                          'left',
                        ),
                        {marginLeft: 20},
                      ]}>
                      Producto
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
                      {name}
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
                      Clientes o invitados
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
                      {clients.length}
                    </Text>

                    <View opacity={0.25} style={styles.separatorLineMini} />

                    <Text
                      style={[
                        Fonts.style.bold(
                          Colors.dark,
                          Fonts.size.medium,
                          'left',
                        ),
                        {marginLeft: 20},
                      ]}>
                      Adicionales comunes
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
                                  'left',
                                ),
                                {marginLeft: 20},
                              ]}>
                              {addonName}{' '}
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
                            'left',
                          ),
                          {marginLeft: 20, marginTop: 10},
                        ]}>
                        No ahi adiciones comunes
                      </Text>
                    )}
                    <View opacity={0.25} style={styles.separatorLineMini} />
                    <Text
                      style={[
                        Fonts.style.bold(
                          Colors.dark,
                          Fonts.size.medium,
                          'left',
                        ),
                        {marginLeft: 20},
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
                                  'left',
                                ),
                                {marginLeft: 20},
                              ]}>
                              Adiconal: {name}{' '}
                              <Text
                                style={[
                                  Fonts.style.bold(
                                    Colors.dark,
                                    Fonts.size.medium,
                                    'left',
                                  ),
                                  {marginLeft: 20},
                                ]}>
                                X{' '}
                                <Text
                                  style={[
                                    Fonts.style.regular(
                                      Colors.dark,
                                      Fonts.size.medium,
                                      'left',
                                    ),
                                    {marginLeft: 20},
                                  ]}>
                                  {count}
                                </Text>
                              </Text>
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
                            'left',
                          ),
                          {marginLeft: 20, marginVertical: 10},
                        ]}>
                        No ahi adiciones comunes
                      </Text>
                    )}
                  </Fragment>
                );
              })}
            <View opacity={0.25} style={styles.separatorLineMini} />

            <Text
              style={[
                Fonts.style.bold(Colors.dark, Fonts.size.medium, 'left'),
                {marginLeft: 20},
              ]}>
              Resumen a cobrar
            </Text>
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
                      Duracion :{' '}
                      <Text
                        style={[
                          Fonts.style.bold(
                            Colors.dark,
                            Fonts.size.medium,
                            'left',
                          ),
                          {marginLeft: 20},
                        ]}>
                        {duration} mins
                      </Text>
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
                      SubTotal :{' '}
                      <Text
                        style={[
                          Fonts.style.bold(
                            Colors.dark,
                            Fonts.size.medium,
                            'left',
                          ),
                          {marginLeft: 20},
                        ]}>
                        {utilities.formatCOP(totalServices)}
                      </Text>
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
                      Adiciones :{' '}
                      <Text
                        style={[
                          Fonts.style.bold(
                            Colors.dark,
                            Fonts.size.medium,
                            'left',
                          ),
                          {marginLeft: 20},
                        ]}>
                        {utilities.formatCOP(totalAddons)}
                      </Text>
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
                      Total de servicios:{' '}
                      <Text
                        style={[
                          Fonts.style.bold(
                            Colors.dark,
                            Fonts.size.medium,
                            'left',
                          ),
                          {marginLeft: 20},
                        ]}>
                        {utilities.formatCOP(total)}
                      </Text>
                    </Text>
                  </Fragment>
                );
              })}
          </View>
        </ScrollView>
        {order.status === 1 && (
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
        {order.status === 2 && (
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
        {order.status === 3 && (
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
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    height: Metrics.screenHeight - 100,
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
    backgroundColor: Colors.expert.primaryColor,
    height: 40,
    width: '90%',
    borderRadius: 10,
    alignSelf: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
});

export default DetailModal;
