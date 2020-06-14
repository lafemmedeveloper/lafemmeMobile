/**
 * Sample React Native App with Firebase
 * https://github.com/invertase/react-native-firebase
 *
 * @format
 * @flow
 */
import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';

import styles from './styles';
import {Fonts, Colors, ApplicationStyles} from '../../Themes';
import Utilities from '../../Utilities';

export default data => {
  return (
    <TouchableOpacity
      onPress={() => data.onAction()}
      style={[styles.container, ApplicationStyles.shadownClient]}>
      <View style={styles.counter}>
        <Text
          style={Fonts.style.bold(
            Colors.light,
            Fonts.size.medium,
            'center',
            1,
          )}>
          {data.servicesNumber}
        </Text>
      </View>
      <View style={styles.title}>
        <Text
          style={Fonts.style.bold(Colors.light, Fonts.size.input, 'left', 1)}>
          {data.title}
        </Text>
      </View>
      <View style={styles.price}>
        <Text
          style={Fonts.style.regular(
            Colors.light,
            Fonts.size.medium,
            'right',
            1,
          )}>
          {Utilities.formatCOP(data.servicesTotal)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
