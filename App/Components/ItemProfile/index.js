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
import {Colors, Fonts} from '../../Themes';
import Icon from 'react-native-vector-icons/FontAwesome5';

export default data => {
  return (
    <TouchableOpacity onPress={() => data.action()} style={styles.itemProfile}>
      <View style={styles.itemIcon}>
        <Icon name={data.icon} size={15} color={Colors.dark} />
      </View>
      <Text
        style={[
          Fonts.style.regular(Colors.dark, Fonts.size.medium, 'center'),
          {marginLeft: 20},
        ]}>
        {data.title}
      </Text>
      {data.decorationLine && <View style={styles.decorationLine} />}
    </TouchableOpacity>
  );
};
