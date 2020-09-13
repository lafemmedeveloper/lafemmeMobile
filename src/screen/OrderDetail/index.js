import React, {useContext, useEffect, useState} from 'react';
import {
  Text,
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import StepIndicator from 'react-native-step-indicator';
import {Colors} from '../../themes';
import {StoreContext} from '../../flux';
import customStyles from './styleStep';
import Status from './Status';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import Icon from 'react-native-vector-icons/FontAwesome5';
import ExpertCall from './Status/ExpertCall';

const OrderDetail = (props) => {
  /* config map */
  const screen = Dimensions.get('window');
  const ASPECT_RATIO = screen.width * 0.8 - 500 / screen.height;
  const mapStyle = require('../../config/mapStyle.json');

  const {route, navigation} = props;
  const {params} = route;

  const {state} = useContext(StoreContext);

  const {util} = state;

  const {ordersAll} = util;
  const [orderUser, setOrderUser] = useState(null);

  const {goBack} = navigation;

  useEffect(() => {
    const currentOrder = ordersAll.filter((item) => item.id === params.id)[0];

    setOrderUser(currentOrder);
  }, [ordersAll]);
  return (
    <>
      <View style={styles.container}>
        {orderUser ? (
          <>
            <View>
              <MapView
                pointerEvents={'none'}
                provider={PROVIDER_GOOGLE} // remove if not using Google Maps
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
              <View style={styles.contBack}>
                <TouchableOpacity style={styles.back} onPress={() => goBack()}>
                  <Icon name={'chevron-left'} size={20} color={Colors.dark} />
                </TouchableOpacity>
              </View>
            </View>

            {orderUser.experts && <ExpertCall expert={orderUser.experts} />}
            <View style={styles.cont}>
              {orderUser.status < 6 && (
                <View
                  style={orderUser.status >= 4 ? styles.step4 : styles.step}>
                  <StepIndicator
                    customStyles={customStyles}
                    currentPosition={orderUser.status}
                    direction={'vertical'}
                    stepCount={4}
                  />
                </View>
              )}

              <View style={styles.containerPosition}>
                <Status
                  status={orderUser.status}
                  id={params.cartId}
                  goBack={goBack}
                  expert={orderUser.experts}
                  orderId={orderUser.id}
                />
              </View>
            </View>
          </>
        ) : (
          <Text>loading....</Text>
        )}
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  container: {flex: 1},
  cont: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: Colors.light,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 20,
  },
  step: {
    alignSelf: 'center',
    marginLeft: 20,
    marginBottom: 20,
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
    height: 300,
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
});
export default OrderDetail;
