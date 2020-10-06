import React from 'react';
import {View, Image, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

import {Colors, Fonts, Images} from '../../themes';

import AppConfig from '../../config/AppConfig';

import moment from 'moment';
import {TouchableOpacity} from 'react-native-gesture-handler';

export default (dta) => {
  const {order, activeDetailModal} = dta;

  const currentService = moment(order.date).format('dd,lll');

  return (
    <>
      <TouchableOpacity
        style={styles.contentContainer}
        onPress={() => activeDetailModal(order)}>
        <View
          style={{
            flex: 1,
            marginHorizontal: 10,
            justifyContent: 'center',
          }}>
          <Text
            numberOfLines={1}
            style={Fonts.style.bold(Colors.light, Fonts.size.small, 'left')}>
            Proxima Orden:{' '}
            <Text
              numberOfLines={1}
              style={Fonts.style.semiBold(
                Colors.light,
                Fonts.size.small,
                'center',
              )}>
              {order.cartId}
            </Text>
          </Text>
          <Text
            style={Fonts.style.regular(Colors.dark, Fonts.size.small, 'left')}>
            <Icon name={'map-marker-alt'} size={12} color={Colors.light} />{' '}
            {order.address.name} {order.address.locality}
            {' - '}
            {order.address.neighborhood}
          </Text>
          <Text
            style={Fonts.style.regular(Colors.dark, Fonts.size.small, 'left')}>
            <Icon name={'calendar'} size={12} color={Colors.light} />{' '}
            {currentService}
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
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    backgroundColor: Colors.expert.primaryColor,
    marginHorizontal: 5,
    padding: 10,
    marginTop: 5,
    borderRadius: 10,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
});
