import React from 'react';
import {View} from 'react-native';
import {WaveIndicator} from 'react-native-indicators';
import styles from './styles';
import {Colors} from 'App/themes';

export default (data) => {
  const {type, loading} = data;
  if (loading) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor:
              type === 'client' ? Colors.pinkMask(0.7) : Colors.expertMask(0.7),
          },
        ]}>
        <WaveIndicator
          color={
            type ? Colors[type].secondaryColor : Colors.client.secondaryColor
          }
        />
      </View>
    );
  } else {
    return null;
  }
};
