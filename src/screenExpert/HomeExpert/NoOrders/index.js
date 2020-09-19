import React from 'react';
import {View, Text, Image} from 'react-native';
import {Fonts, Colors, Images} from '../../../themes';

const NoOrders = () => {
  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: 30,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <View
        style={{
          alignItems: 'center',
          paddingVertical: 50,
          borderRadius: 10,
        }}>
        <Image
          style={{width: 62, height: 100, marginTop: -20, marginBottom: 20}}
          source={Images.handleTime}
        />
        <Text
          style={Fonts.style.semiBold(Colors.dark, Fonts.size.h6, 'center')}>
          {'No hay ordenes actualmente'}
        </Text>
        <Text
          style={Fonts.style.regular(Colors.dark, Fonts.size.medium, 'center')}>
          {
            'Este pendiente de las notificaciones que te avisaremos cuando tengamos nuevos clientes'
          }
        </Text>
      </View>
    </View>
  );
};

export default NoOrders;
