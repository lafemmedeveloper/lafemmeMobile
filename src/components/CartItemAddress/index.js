import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome5';
import {Fonts, Colors, Metrics} from '../../themes';

import AppConfig from '../../config/AppConfig';

export default (data) => {
  const {formattedAddress, type, addressDetail, id} = data.data;

  return (
    <TouchableOpacity
      onPress={() => {
        data.selectAddress();
      }}
      style={styles.container}>
      <TouchableOpacity
        style={{width: 30, justifyContent: 'center', alignItems: 'center'}}>
        {
          <Icon
            name={AppConfig.locationIcon[type]}
            size={20}
            color={Colors.client.primaryColor}
          />
        }
      </TouchableOpacity>
      <View style={styles.productContainer}>
        <Text
          style={Fonts.style.regular(Colors.dark, Fonts.size.small, 'left')}>
          <Icon name={'map-marker-alt'} size={10} color={Colors.gray} />{' '}
          {formattedAddress}
        </Text>

        {addressDetail !== '' && (
          <Text
            style={Fonts.style.regular(Colors.gray, Fonts.size.small, 'left')}>
            <Icon
              name={'map-marker-alt'}
              size={10}
              color={Colors.pinkMask(0)}
            />{' '}
            {addressDetail}
          </Text>
        )}
      </View>

      <TouchableOpacity
        onPress={() => {
          data.removeAddress(id);
        }}
        style={styles.deleteContainer}>
        {
          <Icon
            name={'minus-square'}
            size={20}
            color={Colors.client.primaryColor}
            solid
          />
        }
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 0,
    marginVertical: 2.5,
    borderRadius: Metrics.textInBr,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '90%',
    backgroundColor: Colors.textInputBg,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  productContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 5,
  },

  deleteContainer: {
    flex: 0,
    paddingHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
