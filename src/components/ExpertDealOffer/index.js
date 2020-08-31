import React from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {formatDate} from '../../helpers/MomentHelper';
import moment from 'moment';
import StarRating from 'react-native-star-rating';

import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import {ApplicationStyles, Colors, Fonts, Images, Metrics} from '../../themes';
import Utilities from '../../utilities';
import AppConfig from '../../config/AppConfig';
const mapStyle = require('../../config/mapStyle.json');

const screen = Dimensions.get('window');
const ASPECT_RATIO = screen.width * 0.8 - 500 / screen.height;

export default ({order, onSwipe}) => {
  return (
    <View style={styles.cellContainer}>
      <View style={styles.contentContainer}>
        <View style={styles.contentText}>
          <Text
            numberOfLines={1}
            style={Fonts.style.regular(Colors.gray, Fonts.size.small, 'left')}>
            Orden:{' '}
            <Text
              numberOfLines={1}
              style={Fonts.style.bold(
                Colors.expert.primaryColor,
                Fonts.size.small,
                'center',
              )}>
              {order.cartId}
            </Text>
          </Text>
          <Text
            style={Fonts.style.regular(Colors.dark, Fonts.size.small, 'left')}>
            <Icon
              name={'map-marker-alt'}
              size={12}
              color={Colors.expert.primaryColor}
            />{' '}
            {order.address.name}
          </Text>
          <Text
            style={Fonts.style.regular(Colors.dark, Fonts.size.small, 'left')}>
            <Icon
              name={'calendar'}
              size={12}
              color={Colors.expert.primaryColor}
            />{' '}
            {formatDate(order.day, 'ddd, LL')}
          </Text>
          <Text
            style={Fonts.style.regular(Colors.dark, Fonts.size.small, 'left')}>
            <Icon name={'clock'} size={12} color={Colors.expert.primaryColor} />{' '}
            {formatDate(moment(order.hour, 'HH:mm'), 'h:mm a')}
          </Text>
        </View>
        <View
          style={{
            width: 140,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            source={Images.moto}
            style={{
              height: 55,
              width: 140,
              resizeMode: 'contain',
            }}
          />
          <View
            style={{
              backgroundColor: Colors.status[order.status],
              marginTop: 5,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 10,
              paddingHorizontal: 10,
            }}>
            <Text
              numberOfLines={1}
              style={Fonts.style.bold(Colors.light, Fonts.size.tiny, 'left')}>
              {AppConfig.orderStatusStr[order.status]}
            </Text>
          </View>
        </View>
      </View>

      {order.services.map((item, index) => {
        return (
          <View key={index} style={styles.contentText}>
            <Text
              numberOfLines={1}
              style={Fonts.style.regular(
                Colors.gray,
                Fonts.size.small,
                'left',
              )}>
              Servicio:{' '}
              <Text
                numberOfLines={1}
                style={Fonts.style.bold(
                  Colors.expert.primaryColor,
                  Fonts.size.small,
                  'center',
                )}>
                {item.name}
                <Text
                  numberOfLines={1}
                  style={Fonts.style.regular(
                    Colors.gray,
                    Fonts.size.small,
                    'left',
                  )}>
                  , Total:{' '}
                  <Text
                    numberOfLines={1}
                    style={Fonts.style.bold(
                      Colors.expert.primaryColor,
                      Fonts.size.small,
                      'center',
                    )}>
                    {Utilities.formatCOP(item.total)}
                  </Text>
                </Text>
              </Text>
            </Text>
            <Text
              numberOfLines={1}
              style={Fonts.style.regular(
                Colors.gray,
                Fonts.size.small,
                'left',
              )}>
              Clientes:{' '}
              <Text
                numberOfLines={1}
                style={Fonts.style.bold(
                  Colors.expert.primaryColor,
                  Fonts.size.small,
                  'center',
                )}>
                {item.clients.length}
                <Text
                  numberOfLines={1}
                  style={Fonts.style.regular(
                    Colors.gray,
                    Fonts.size.small,
                    'left',
                  )}>
                  , Calificación:{' '}
                  <Text
                    numberOfLines={1}
                    style={Fonts.style.bold(
                      Colors.expert.primaryColor,
                      Fonts.size.small,
                      'center',
                    )}>
                    {(order.client.rating ? order.client.rating : 5).toFixed(1)}
                  </Text>
                </Text>
              </Text>
            </Text>

            <Text
              numberOfLines={1}
              style={Fonts.style.regular(
                Colors.gray,
                Fonts.size.small,
                'left',
              )}>
              Expertos:{' '}
              <Text
                numberOfLines={1}
                style={Fonts.style.bold(
                  Colors.expert.primaryColor,
                  Fonts.size.small,
                  'center',
                )}>
                {item.experts.length}
              </Text>
            </Text>

            {item.experts.length > 0 &&
              item.experts.map((expert, idex) => {
                return (
                  <View
                    key={idex}
                    style={[
                      styles.container,
                      styles.containerBottom,
                      ApplicationStyles.shadownClient,
                    ]}>
                    {expert.id == null ? (
                      <View
                        style={{
                          width: '100%',
                          flexDirection: 'row',
                          alignContent: 'center',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}>
                        <View
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: 20,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: Colors.expert.secondaryColor,
                            marginRight: 10,
                          }}>
                          <ActivityIndicator
                            size={'small'}
                            color={Colors.light}
                          />
                        </View>
                        <Text
                          style={Fonts.style.regular(
                            Colors.dark,
                            Fonts.size.small,
                            'left',
                          )}>
                          {'Buscando Experto...'}
                        </Text>
                        <TouchableOpacity
                          style={{
                            backgroundColor: Colors.dark,
                            borderRadius: Metrics.borderRadius,
                            paddingHorizontal: 5,
                            paddingVertical: 2.5,
                          }}
                          onPress={() => {
                            Alert.alert(
                              'Aplicar a servicio',
                              'Realmente deseas aplicar a este servio\n\nRecuerda que no puedes cancelar y si tienes alguna novedad la debes reportar con la administracion',
                              [
                                {
                                  text: 'No solicitar',
                                  onPress: () => console.log('Cancel Pressed'),
                                  style: 'cancel',
                                },
                                {
                                  text: 'Solicitar',
                                  onPress: () => {
                                    console.log('Solicitar');
                                    onSwipe();
                                  },
                                },
                              ],
                              {cancelable: false},
                            );
                          }}>
                          <Text
                            style={Fonts.style.bold(
                              Colors.expert.primaryColor,
                              Fonts.size.small,
                              'left',
                            )}>
                            Solicitar
                          </Text>
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <Image
                        source={{uri: expert.thumbnail}}
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 20,
                          marginRight: 10,
                        }}
                      />
                    )}
                    <View style={{flex: 1}}>
                      <Text
                        style={Fonts.style.bold(
                          Colors.dark,
                          Fonts.size.small,
                          'left',
                        )}>
                        {expert.firstName} {expert.lastName}
                      </Text>
                      {expert.ranking && (
                        <View style={{width: 300, flexDirection: 'row'}}>
                          <StarRating
                            disabled={true}
                            maxStars={5}
                            rating={expert.ranking ? expert.ranking : 5}
                            starSize={15}
                            emptyStarColor={Colors.gray}
                            fullStarColor={Colors.expert.primaryColor}
                          />
                          <Text
                            style={Fonts.style.regular(
                              Colors.dark,
                              Fonts.size.small,
                              'left',
                            )}>
                            {' '}
                            {expert.ranking}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                );
              })}
          </View>
        );
      })}

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
            color={Colors.expert.primaryColor}
          />
        </Marker.Animated>
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 0,
    alignSelf: 'center',
    width: '95%',
  },
  cancelBtn: {
    flex: 1,
    marginVertical: 20,
    borderRadius: Metrics.textInBr,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginHorizontal: 0,
    backgroundColor: Colors.textInputBg,
    paddingHorizontal: 20,
    paddingVertical: 2,
  },

  containerBottom: {
    flex: 0,
    marginVertical: 5,
    borderRadius: Metrics.textInBr,
    alignSelf: 'center',
    flexDirection: 'row',

    backgroundColor: Colors.textInputBg,
    paddingHorizontal: 10,
    paddingVertical: 10,
    width: '80%',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  mapView: {
    width: '100%',
    height: 120,
    borderRadius: Metrics.borderRadius,
    marginTop: 10,
  },
  contentText: {
    flex: 1,
    marginHorizontal: 10,
    justifyContent: 'center',
  },
  starts: {
    width: 100,
    alignSelf: 'center',
    marginVertical: 5,
  },
  swipe: {flex: 0, marginTop: 10},
  cellContainer: {
    backgroundColor: Colors.light,
    justifyContent: 'center',
    marginHorizontal: 5,
    padding: 10,
    marginTop: 5,
    borderRadius: 10,

    shadowColor: Colors.client.primaryColor,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.2,
    shadowRadius: 0.84,

    elevation: 2,
  },

  contentContainer: {flexDirection: 'row'},
});
