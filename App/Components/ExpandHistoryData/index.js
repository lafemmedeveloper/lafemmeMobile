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
  ScrollView,
  StyleSheet,
  Alert,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {getDate, formatDate} from '../../Helpers/MomentHelper';
import moment from 'moment';

import styles from './styles';
import {ApplicationStyles, Colors, Fonts, Images, Metrics} from '../../Themes';
import FastImage from 'react-native-fast-image';
import Utilities from '../../Utilities';
import _ from 'lodash';
import CardItemCart from '../../Components/CardItemCart';
import FieldCartConfig from '../../Components/FieldCartConfig';
import LinearGradient from 'react-native-linear-gradient';

var orderStatusStr = {
  0: 'Buscando Expertos',
  1: 'Preparando Servicio',
  2: 'En Ruta',
  3: 'En servicio',
  4: 'Esperando Calificacion',
  5: 'Finalizado',
  6: 'Cancelado',
};

export default dta => {
  const {order, user} = dta;

  return (
    <View
      // key={order.cartId}
      style={styles.contentContainer}>
      <View
        style={{
          flex: 1,
          marginHorizontal: 10,
          justifyContent: 'center',
        }}>
        <Text
          numberOfLines={1}
          style={Fonts.style.regular(Colors.gray, Fonts.size.small, 'left')}>
          Orden:{' '}
          <Text
            numberOfLines={1}
            style={Fonts.style.bold(
              Colors.client.primartColor,
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
            color={Colors.client.primartColor}
          />{' '}
          {order.address.name}
        </Text>
        <Text
          style={Fonts.style.regular(Colors.dark, Fonts.size.small, 'left')}>
          <Icon
            name={'calendar'}
            size={12}
            color={Colors.client.primartColor}
          />{' '}
          {formatDate(order.day, 'ddd, LL')}
        </Text>
        <Text
          style={Fonts.style.regular(Colors.dark, Fonts.size.small, 'left')}>
          <Icon name={'clock'} size={12} color={Colors.client.primartColor} />{' '}
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
            {orderStatusStr[order.status]}
          </Text>
        </View>
      </View>
    </View>
  );
};
