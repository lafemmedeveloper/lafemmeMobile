/**
 * Sample React Native App with Firebase
 * https://github.com/invertase/react-native-firebase
 *
 * @format
 * @flow
 */
import React from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Alert,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {getDate, formatDate} from '../../Helpers/MomentHelper';
import moment from 'moment';
import StarRating from 'react-native-star-rating';

import MapView, {
  PROVIDER_GOOGLE,
  Marker,
  AnimatedRegion,
} from 'react-native-maps';
import SwipeButton from 'rn-swipe-button';
import styles from './styles';
import {ApplicationStyles, Colors, Fonts, Images, Metrics} from '../../Themes';
import FastImage from 'react-native-fast-image';
import Utilities from '../../Utilities';
import _ from 'lodash';
import CardItemCart from '../../Components/CardItemCart';
import FieldCartConfig from '../../Components/FieldCartConfig';
import LinearGradient from 'react-native-linear-gradient';
import AppConfig from '../../Config/AppConfig';
import Orders from '../../Screens/Orders';

const mapStyle = require('../../Config/mapStyle.json');

const screen = Dimensions.get('window');
const ASPECT_RATIO = screen.width * 0.8 - 500 / screen.height;
const LATITUDE_DELTA = 0.0003;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default dta => {
  const {order} = dta;

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
            // flex: 0,
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

            {/* <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text
                numberOfLines={1}
                style={Fonts.style.regular(
                  Colors.gray,
                  Fonts.size.small,
                  'left',
                )}>
                Calificacion del cliente:{'  '}
              </Text>
              <StarRating
                disabled={true}
                maxStars={5}
                containerStyle={styles.starts}
                fullStarColor={Colors.expert.primaryColor}
                rating={order.client.rating ? order.client.rating : 5}
                starSize={15}
                // selectedStar={(rating) => }
              />
            </View> */}

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

            {/* <Text
              numberOfLines={1}
              style={Fonts.style.regular(
                Colors.gray,
                Fonts.size.small,
                'left',
              )}>
              Servicios:{' '}
              <Text
                numberOfLines={1}
                style={Fonts.style.bold(
                  Colors.expert.primaryColor,
                  Fonts.size.small,
                  'center',
                )}>
                {Utilities.formatCOP(item.totalServices)}
              </Text>
            </Text>

            <Text
              numberOfLines={1}
              style={Fonts.style.regular(
                Colors.gray,
                Fonts.size.small,
                'left',
              )}>
              Adicionales:{' '}
              <Text
                numberOfLines={1}
                style={Fonts.style.bold(
                  Colors.expert.primaryColor,
                  Fonts.size.small,
                  'center',
                )}>
                {Utilities.formatCOP(item.totalAddons)}
              </Text>
            </Text> */}

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
                      <>
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
                          Buscando Experto...
                        </Text>
                      </>
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
                            // halfStarColor={Colors.client.secondaryColor}
                            // selectedStar={(rating) => }
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
      <View style={styles.swipe}>
        <SwipeButton
          disabled={false}
          onSwipeStart={() => console.log('Swipe started!')}
          onSwipeFail={() => console.log('Incomplete swipe!')}
          onSwipeSuccess={() => dta.onSwipe()}
          railBackgroundColor={Colors.expertMask(0.4)}
          railBorderColor={'transparent'}
          titleColor={Colors.light}
          railFillBackgroundColor={Colors.expertMask(0.6)}
          railFillBorderColor={'transparent'}
          shouldResetAfterSuccess={false}
          titleStyles={Fonts.style.bold(Colors.dark, Fonts.size.h6, 'center')}
          swipeSuccessThreshold={90}
          thumbIconBackgroundColor={Colors.expert.primaryColor}
          thumbIconBorderColor={'transparent'}
          title={'Aceptar Servicio'}
        />
      </View>
    </View>
  );
};
