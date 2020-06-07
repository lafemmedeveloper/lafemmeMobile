/**
 * Sample React Native App with Firebase
 * https://github.com/invertase/react-native-firebase
 *
 * @format
 * @flow
 */
import React from 'react';
import {View, Image, Text, TouchableOpacity} from 'react-native';

import {ApplicationStyles, Colors, Fonts, Images} from '../../Themes';
import AppConfig from '../../Config/AppConfig';
import LinearGradient from 'react-native-linear-gradient';
import {formatDate} from '../../Helpers/MomentHelper';
import Icon from 'react-native-vector-icons/FontAwesome5';
import moment from 'moment';
import styles from './styles';

export default ({item, appType, onPress}) => {
  return (
    <TouchableOpacity
      onPress={() => {
        onPress();
      }}>
      <LinearGradient
        style={[
          ApplicationStyles.bannerOrders,
          ApplicationStyles.shadownClient,
        ]}
        colors={[Colors[appType].primaryColor, Colors[appType].secondaryColor]}
        start={{x: 0, y: 1}}
        end={{x: 1, y: 0}}>
        <View
          style={{
            flex: 1,
            marginHorizontal: 15,
            justifyContent: 'center',
          }}>
          <Text
            style={Fonts.style.bold(Colors.light, Fonts.size.small, 'left')}>
            Mi Proximo Servicio:
          </Text>
          <Text
            style={Fonts.style.regular(Colors.light, Fonts.size.small, 'left')}>
            <Icon name={'map-marker-alt'} size={12} color={Colors.light} />{' '}
            {item.address.name}
          </Text>
          <Text
            style={Fonts.style.regular(Colors.light, Fonts.size.small, 'left')}>
            <Icon name={'calendar'} size={12} color={Colors.light} />{' '}
            {formatDate(item.day, 'ddd, LL')}
          </Text>
          <Text
            style={Fonts.style.regular(Colors.light, Fonts.size.small, 'left')}>
            <Icon name={'clock'} size={12} color={Colors.light} />{' '}
            {formatDate(moment(item.hour, 'HH:mm'), 'h:mm a')}
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
              backgroundColor: Colors.status[item.status],
              marginTop: 5,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 10,
              paddingHorizontal: 10,
            }}>
            <Text
              numberOfLines={1}
              style={Fonts.style.bold(Colors.light, Fonts.size.tiny, 'left')}>
              {AppConfig.orderStatusStr[item.status]}
            </Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};
