/**
 * Sample React Native App with Firebase
 * https://github.com/invertase/react-native-firebase
 *
 * @format
 * @flow
 */
import React from 'react';
import {View} from 'react-native';
import {WaveIndicator} from 'react-native-indicators';
import styles from './styles';
import {Colors} from '../../Themes';

export default data => {
  if (data.loading) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor:
              [data.type] === 'client'
                ? Colors.Colors.pinkMask(0.7)
                : Colors.expertMask(0.7),
          },
        ]}>
        <WaveIndicator color={Colors[data.type].secondaryColor} />
      </View>
    );
  } else {
    return null;
  }
};
