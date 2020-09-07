import React from 'react';
import {View, Image, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {formatDate} from '../../helpers/MomentHelper';

import {Colors, Fonts, Images} from '../../themes';

import AppConfig from '../../config/AppConfig';

// var orderStatusStr = {
//   0: 'Buscando Expertos',
//   1: 'Preparando Servicio',
//   2: 'En Ruta',
//   3: 'En servicio',
//   4: 'Esperando Calificacion',
//   5: 'Finalizado',
//   6: 'Cancelado',
// };

export default (dta) => {
  const {order, appType} = dta;

  return (
    <View style={styles.contentContainer}>
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
          {formatDate(order.day, 'ddd, LLL')}
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
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    backgroundColor: Colors.light,
    marginHorizontal: 5,
    padding: 10,
    marginTop: 5,
    borderRadius: 10,
    flexDirection: 'row',
  },
});
