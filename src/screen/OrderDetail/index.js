import React, {useContext, useEffect, useState} from 'react';
import {
  Text,
  StyleSheet,
  View,
  Dimensions,
  StatusBar,
  Alert,
  TouchableOpacity,
} from 'react-native';
import StepIndicator from 'react-native-step-indicator';
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

const customStyles = {
  stepIndicatorSize: 30,
  currentStepIndicatorSize: 30,
  separatorStrokeWidth: 2,
  currentStepStrokeWidth: 3,
  stepStrokeCurrentColor: Colors.expert.primaryColor,
  stepStrokeWidth: 2,
  stepStrokeFinishedColor: Colors.expert.secondaryColor,
  stepStrokeUnFinishedColor: '#aaaaaa',
  separatorFinishedColor: Colors.expert.secondaryColor,
  separatorUnFinishedColor: '#aaaaaa',
  stepIndicatorFinishedColor: Colors.expert.primaryColor,
  stepIndicatorUnFinishedColor: '#ffffff',
  stepIndicatorCurrentColor: '#ffffff',
  stepIndicatorLabelFontSize: 16,
  currentStepIndicatorLabelFontSize: 16,
  stepIndicatorLabelCurrentColor: Colors.expert.primaryColor,
  stepIndicatorLabelFinishedColor: '#ffffff',
  stepIndicatorLabelUnFinishedColor: '#aaaaaa',
  labelColor: '#999999',
  labelSize: 15,
  labelAlign: 'flex-start',
  currentStepLabelColor: Colors.expert.primaryColor,
};
const OrderDetail = (props) => {
  /* config map */
  const screen = Dimensions.get('window');
  const ASPECT_RATIO = screen.width * 0.8 - 500 / screen.height;
  const mapStyle = require('../../config/mapStyle.json');

  const {route, navigation} = props;
  const {params} = route;

  const {state, utilDispatch} = useContext(StoreContext);
  const {util} = state;
  const {ordersAll} = util;
  const [orderUser, setOrderUser] = useState(null);
  const [modalQual, setModalQual] = useState(false);

  const [coordinate, setCoordinate] = useState(null);

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
  return (
    <>
      {util.Loading && <Loading type="client" />}

      <StatusBar backgroundColor={Colors.expert.primaryColor} />
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
                    {orderUser.experts && (
                      <Marker.Animated
                        coordinate={{
                          latitude: orderUser.experts.coordinate.latitude,
                          longitude: orderUser.experts.coordinate.longitude,
                        }}>
                        <Icon
                          name={'map-marker-alt'}
                          size={30}
                          color={Colors.expert.primaryColor}
                        />
                      </Marker.Animated>
                    )}
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

            <ExpertCall expert={orderUser.experts} />
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
                  {orderUser.date}
                </Text>
              </View>

              <View style={styles.cont}>
                {orderUser.status < 6 && (
                  <View style={styles.step}>
                    <StepIndicator
                      customStyles={customStyles}
                      currentPosition={orderUser.status}
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
                )}
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
                        await updateStatus(5, orderUser, utilDispatch);
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

  containerPosition: {
    marginVertical: 20,
    width: '100%',
    justifyContent: 'center',
    flex: 1,
  },
  mapView: {
    height: Metrics.screenHeight / 4,
    width: '100%',
    zIndex: 1,
  },
  back: {
    backgroundColor: Colors.light,
    height: 50,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.39,
    shadowRadius: 8.3,

    elevation: 13,
  },
  contBack: {
    position: 'absolute',
    zIndex: 2,
    marginLeft: 10,
    marginTop: 10,
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
    bottom: 20,
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
