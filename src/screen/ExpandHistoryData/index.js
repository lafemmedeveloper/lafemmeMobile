import React from 'react';
import {View, Image, Text, StyleSheet} from 'react-native';

//Modules
import Icon from 'react-native-vector-icons/FontAwesome5';

//Theme
import {Colors, Fonts, Images} from '../../themes';

//Utilities
import AppConfig from '../../config/AppConfig';
import {formatDate} from '../../helpers/MomentHelper';

export default ({order, appType}) => {
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
