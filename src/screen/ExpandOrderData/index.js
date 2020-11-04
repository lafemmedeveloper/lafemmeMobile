import React from 'react';
import {View, Image, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

import {Colors, Fonts, Images} from '../../themes';

import AppConfig from '../../config/AppConfig';

import moment from 'moment';

export default (dta) => {
  const {order, appType, activeDetailModal} = dta;
  const currentService = moment(order.date).format('dd,ll');

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
            style={Fonts.style.regular(Colors.gray, Fonts.size.small, 'left')}>
            Orden:{' '}
            <Text
              numberOfLines={1}
              style={Fonts.style.bold(
                Colors[appType].primaryColor,
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
              color={Colors[appType].primaryColor}
            />{' '}
            {order.address.name}
          </Text>
          <Text
            style={Fonts.style.regular(Colors.dark, Fonts.size.small, 'left')}>
            <Icon
              name={'calendar'}
              size={12}
              color={Colors[appType].primaryColor}
            />{' '}
            {currentService}
          </Text>
          {appType === 'client' && (
            <Text
              style={Fonts.style.regular(
                Colors.dark,
                Fonts.size.small,
                'left',
              )}>
              <Icon
                name={'user-alt'}
                size={12}
                color={Colors[appType].primaryColor}
              />{' '}
              {order.experts && order.experts.length > 0
                ? order.experts.length
                : 'Buscando expertos.....'}
            </Text>
          )}
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
    backgroundColor: Colors.light,
    marginHorizontal: 10,
    padding: 20,
    marginTop: 5,
    borderRadius: 10,
    flexDirection: 'row',

    shadowColor: Colors.client.primaryColors,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
