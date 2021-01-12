import React from 'react';
import {View, Text, Image} from 'react-native';
import {Fonts, Colors, Images} from '../../../themes';

const NoOrders = (props) => {
  const {user} = props;
  return (
    <>
      {user && user.isEnabled ? (
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
              style={{
                width: 100,
                height: 100,
                marginTop: -20,
                marginBottom: 20,
                resizeMode: 'contain',
                tintColor: Colors.expert.primaryColor,
              }}
              source={Images.handleTime}
            />
            <Text
              style={Fonts.style.semiBold(
                Colors.dark,
                Fonts.size.h6,
                'center',
              )}>
              {'No hay ordenes disponibles'}
            </Text>
            <Text
              style={[
                Fonts.style.regular(Colors.dark, Fonts.size.medium, 'center'),
                {marginVertical: 10},
              ]}>
              {
                'Te notificaremos cuando un cliente solicite un servicio de tus categorías disponibles'
              }
            </Text>
          </View>
        </View>
      ) : (
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
              style={{
                width: 150,
                height: 150,
                marginTop: -20,
                marginBottom: 20,
                resizeMode: 'contain',
                tintColor: Colors.expert.primaryColor,
              }}
              source={Images.noConection}
            />
            <Text
              style={Fonts.style.semiBold(
                Colors.dark,
                Fonts.size.h6,
                'center',
              )}>
              {'¡Oye! Conectate'}
            </Text>
            <Text
              style={Fonts.style.regular(
                Colors.dark,
                Fonts.size.medium,
                'center',
              )}>
              {'Conectate para recibir nuevas ordenés'}
            </Text>
          </View>
        </View>
      )}
    </>
  );
};

export default NoOrders;
