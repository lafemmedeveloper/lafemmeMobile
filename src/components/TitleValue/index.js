import React from 'react';
import {View, Text} from 'react-native';
import styles from './styles';
import {Fonts, Colors} from 'App/themes';

export default (data) => {
  const {title, value, width, titleType} = data;
  return (
    <View style={[styles.container, {width}]}>
      <Text
        style={Fonts.style[titleType](Colors.dark, Fonts.size.small, 'left')}>
        {title}
      </Text>

      <Text
        style={Fonts.style[titleType](Colors.dark, Fonts.size.small, 'left')}>
        {value}
      </Text>
    </View>
  );
};
