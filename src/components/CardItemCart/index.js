import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

import {Fonts, Colors, ApplicationStyles, Metrics} from '../../themes';
import {minToHours} from '../../helpers/MomentHelper';
import moment from 'moment';

export default (data) => {
  const {name, id, duration, clients, experts} = data.data;
  console.log('experts =>', experts);
  const {dateOrder} = data;

  return (
    <>
      <View style={[styles.container, ApplicationStyles.shadowsClient]}>
        <View style={styles.productContainer}>
          <Text
            style={Fonts.style.bold(Colors.dark, Fonts.size.medium, 'left')}>
            {name}
          </Text>
          <Text
            style={Fonts.style.regular(Colors.dark, Fonts.size.small, 'left')}>
            <Icon name={'clock'} size={15} color={Colors.client.primaryColor} />{' '}
            Duración {minToHours(duration ? duration : 0)}
            {!data.isCart &&
              `, iniciando: ${moment(dateOrder, 'YYYY-MM-DD  HH:mm').format(
                'h:mm a',
              )}`}
          </Text>

          <Text
            style={Fonts.style.regular(Colors.dark, Fonts.size.small, 'left')}>
            <Icon
              name={'user-friends'}
              size={12}
              color={Colors.client.primaryColor}
            />{' '}
            {clients.length} Usuarios
          </Text>
        </View>

        {data.isCart && (
          <TouchableOpacity
            onPress={() => {
              data.removeItem(id);
            }}
            style={styles.deleteContainer}>
            <Icon
              name={'minus-square'}
              size={20}
              color={Colors.client.primaryColor}
              solid
            />
          </TouchableOpacity>
        )}
      </View>
      {data.showExperts && (
        <Text
          style={Fonts.style.bold(
            Colors.client.primaryColor,
            Fonts.size.small,
            'center',
          )}>
          {'Expertos'}
        </Text>
      )}
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 0,
    marginVertical: 5,
    borderRadius: Metrics.textInBr,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '90%',
    backgroundColor: Colors.textInputBg,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },

  containerBottom: {
    width: '80%',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  imageContainer: {flex: 0},
  image: {width: 80, height: 80, borderRadius: Metrics.borderRadius},
  productContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  priceContainer: {
    flex: 0,
    paddingHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteContainer: {
    flex: 1,
    paddingHorizontal: 5,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  textInput: {
    width: Metrics.screenWidth * 0.8,
    height: 40,
    borderColor: 'transparent',
    borderWidth: 1,
  },
});
