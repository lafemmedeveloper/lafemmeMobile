/**
 * Sample React Native App with Firebase
 * https://github.com/invertase/react-native-firebase
 *
 * @format
 * @flow
 */
import React from 'react';
import {View, Text, Image} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome5';

import styles from './styles';
import {Fonts, Colors, Images} from '../../Themes';
import Utilities from '../../Utilities';
import {minToHours} from '../../Helpers/MomentHelper';

export default data => {
  const {name, total, duration, clients, experts} = data.data;

  return (
    <View style={styles.container}>
      <View style={styles.productContainer}>
        <Text style={Fonts.style.bold(Colors.dark, Fonts.size.medium, 'left')}>
          {name}
        </Text>
        <Text
          style={Fonts.style.regular(Colors.dark, Fonts.size.small, 'left')}>
          <Icon name={'clock'} size={15} color={Colors.client.primartColor} />{' '}
          {minToHours(duration)}
        </Text>
        <Text
          style={Fonts.style.regular(Colors.dark, Fonts.size.small, 'left')}>
          <Icon
            name={'user-friends'}
            size={12}
            color={Colors.client.primartColor}
          />{' '}
          {clients.length} Usuarios
        </Text>
        <Text
          style={Fonts.style.regular(Colors.dark, Fonts.size.small, 'left')}>
          <Icon
            name={'id-badge'}
            size={18}
            color={Colors.client.primartColor}
          />{' '}
          {experts} Expertos
        </Text>
      </View>
      <View style={styles.priceContainer}>
        <Text
          style={Fonts.style.regular(Colors.dark, Fonts.size.medium, 'left')}>
          {Utilities.formatCOP(total)}
        </Text>
      </View>

      <View style={styles.deleteContainer}>
        {
          <Icon
            name={'minus-square'}
            size={20}
            color={Colors.client.primartColor}
            solid
          />
        }
      </View>
    </View>
  );
};
