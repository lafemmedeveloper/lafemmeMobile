import React, {Fragment} from 'react';
import {
  Text,
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  Platform,
  Linking,
} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import Icon from 'react-native-vector-icons/FontAwesome5';

import {Colors, Fonts, ApplicationStyles} from '../../../themes';
import StarRating from 'react-native-star-rating';
import {ScrollView} from 'react-native-gesture-handler';
import ButtonCoordinate from './ButtonCoordinate';
import ButtonMaps from './ButtonMaps';

const DetailModal = (props) => {
  const {order} = props;
  const {client, services, cartId} = order;
  const mapStyle = require('../../../config/mapStyle.json');

  const screen = Dimensions.get('window');
  const ASPECT_RATIO = screen.width * 0.8 - 500 / screen.height;
  console.log('order =============>', order);

  const goLocation = () => {
    const {address} = order;
    const {coordinates} = address;
    const {longitude, latitude} = coordinates;

    const url = Platform.select({
      ios:
        'maps:' + latitude + ',' + longitude + '?q=' + address.formattedAddress,
      android:
        'geo:' + latitude + ',' + longitude + '?q=' + address.formattedAddress,
    });
    Linking.openURL(url);
  };
  return (
    <View style={styles.container}>
      <View style={styles.contButtonMap}>
        <ButtonMaps goLocation={goLocation} />
      </View>
      {/*    <Icon
        name={'running'}
        size={50}
        color={Colors.expert.primaryColor}
        style={styles.iconRunning}
      />
      <Text style={Fonts.style.regular(Colors.dark, Fonts.size.h6, 'center')}>
        {'Detalle de la orden'}
        {cartId}
      </Text> */}
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
      <ScrollView style={styles.contDetail}>
        {/* Container */}
        <View>
          <Text>Detalle de direccion</Text>
        </View>
        <View opacity={0.25} style={ApplicationStyles.separatorLine} />
        <View>
          <Text>{`${client.firstName} ${client.lastName}`}</Text>
          <View style={styles.containerStart}>
            <StarRating
              disabled={true}
              maxStars={5}
              rating={client.rating ? parseFloat(client.rating) : 5}
              starSize={15}
              emptyStarColor={Colors.gray}
              fullStarColor={Colors.start}
              halfStarColor={Colors.expert.primaryColor}
            />
          </View>

          <View opacity={0.25} style={ApplicationStyles.separatorLine} />

          {services &&
            services.map((item, index) => {
              const {duration, name, total, totalAddons, totalServices} = item;

              return (
                <Fragment key={index}>
                  <Text>Nombre :{name}</Text>
                  <Text>Total :{total}</Text>
                  <Text>Total de addons :{totalAddons}</Text>
                  <Text>duracion :{duration}</Text>
                  <Text>total de servicios:{totalServices}</Text>
                </Fragment>
              );
            })}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '95%',
  },
  mapView: {
    width: '100%',
    height: 300,
  },
  containerStart: {
    width: 100,
  },
  contButtonMap: {
    position: 'absolute',
    flex: 0,
    justifyContent: 'flex-end',
    zIndex: 20,
    alignSelf: 'flex-end',
    top: 220,
    right: 20,
  },
});

export default DetailModal;
