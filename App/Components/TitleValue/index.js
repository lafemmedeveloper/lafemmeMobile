/**
 * Sample React Native App with Firebase
 * https://github.com/invertase/react-native-firebase
 *
 * @format
 * @flow
 */
import React from 'react';
import {View, Text} from 'react-native';
import styles from './styles';
import {Fonts, Colors} from '../../Themes';

export default data => {
  const {
    title,
    value,
    width,
    titleType,
    letterSpacingTittle,
    letterSpacingValue,
  } = data;
  return (
    <View style={[styles.container, {width}]}>
      <Text
        style={Fonts.style[titleType](
          Colors.dark,
          Fonts.size.medium,
          'left',
          letterSpacingTittle ? letterSpacingTittle : 1,
        )}>
        {title}
      </Text>

      <Text
        style={Fonts.style[titleType](
          Colors.dark,
          Fonts.size.medium,
          'left',
          letterSpacingValue ? letterSpacingValue : 1,
        )}>
        {value}
      </Text>
    </View>
  );
};
