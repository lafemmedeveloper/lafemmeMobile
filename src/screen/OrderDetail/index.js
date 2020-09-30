import React, {useContext, useEffect, useState} from 'react';
import {
  Text,
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import StepIndicator from 'react-native-step-indicator';
import {Colors, Metrics, Fonts} from '../../themes';
import {StoreContext} from '../../flux';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import Icon from 'react-native-vector-icons/FontAwesome5';
import ExpertCall from './Status/ExpertCall';
import Loading from '../../components/Loading';
import Qualification from './Status/Qualification';
import ModalApp from '../../components/ModalApp';

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
  labelSize: 16,
  labelAlign: 'flex-start',
  currentStepLabelColor: Colors.expert.primaryColor,
};
const OrderDetail = (props) => {
  /* config map */
  const screen = Dimensions.get('window');
  const ASPECT_RATIO = screen.width * 0.8 - 500 / screen.height;
  const mapStyle = require('../../config/mapStyle.json');

  const {route, navigation} = props;
  console.log('props', props);
  const {params} = route;

  const {state} = useContext(StoreContext);
  const {util} = state;
  const {ordersAll} = util;
  const [orderUser, setOrderUser] = useState(null);
  const [modalQual, setModalQual] = useState(false);

  console.log('util', util);

  const {goBack} = navigation;

  useEffect(() => {
    const currentOrder = ordersAll.filter((item) => item.id === params.id)[0];

    setOrderUser(currentOrder);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ordersAll]);

  console.log('orderUser', orderUser);
  return (
    <>
      <View style={styles.container}>
        {orderUser ? (
          <>
            <View>
              <MapView
                pointerEvents={'none'}
                // provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                style={styles.mapView}
                customMapStyle={mapStyle}
                region={{
                  latitude: orderUser.address.coordinates.latitude,
                  longitude: orderUser.address.coordinates.longitude,
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
              <View
                style={{
                  height: 40 + Metrics.addHeader,
                  paddingTop: Metrics.addHeader,
                  width: Metrics.screenWidth,
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
            <View
              style={{
                flex: 0,
                paddingVertical: 20,
                justifyContent: 'center',
                width: Metrics.screenWidth,
                backgroundColor: Colors.light,
                marginHorizontal: 20,
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
            {orderUser.status === 4 && (
              <TouchableOpacity
                style={{height: 50}}
                onPress={() => setModalQual(true)}>
                <Text>Calificar</Text>
              </TouchableOpacity>
            )}
            <View style={styles.cont}>
              {orderUser.status < 6 && (
                <View style={styles.step}>
                  <StepIndicator
                    customStyles={customStyles}
                    currentPosition={orderUser.status}
                    direction={'vertical'}
                    stepCount={4}
                    labels={[
                      'Buscando Experto',
                      'Preparando Orden',
                      'En ruta',
                      'En Servicio',
                    ]}
                  />
                </View>
              )}
            </View>
            <View
              style={{
                width: Metrics.screenWidth,
                flex: 0,
                paddingVertical: 10,
                alignContent: 'center',
                justifyContent: 'center',
                paddingBottom: Metrics.addFooter + 10,
                backgroundColor: Colors.light,
              }}>
              <Text
                style={Fonts.style.underline(
                  Colors.dark,
                  Fonts.size.medium,
                  'center',
                )}>
                Contactar a soporte
              </Text>
            </View>
          </>
        ) : (
          <Loading type={'client'} />
        )}
      </View>
      <ModalApp open={modalQual} setOpen={setModalQual}>
        {orderUser && (
          <Qualification id={orderUser.id} expert={orderUser.experts} />
        )}
      </ModalApp>
    </>
  );
};
const styles = StyleSheet.create({
  container: {flex: 1},
  cont: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: Colors.light,
  },
  step: {
    width: Metrics.screenWidth,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'flex-start',
    alignSelf: 'center',
  },
  step4: {
    marginTop: 10,
    marginLeft: 20,
    marginBottom: 20,
    height: 150,
  },

  containerPosition: {
    marginVertical: 20,
    width: '100%',
    justifyContent: 'center',
    flex: 1,
  },
  mapView: {
    height: '50%',
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
});

export default OrderDetail;
