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

export default data => {
  const {value, textActive, textInactive, textSecondary} = data;

  return (
    <View style={styles.container}>
      <View style={styles.deleteContainer}>
        {<Icon name={data.icon} size={20} color={Colors.client.primartColor} />}
      </View>
      <View style={styles.productContainer}>
        {value ? (
          <>
            <Text
              style={Fonts.style.regular(
                Colors.dark,
                Fonts.size.small,
                'left',
              )}>
              {textActive}
            </Text>
            {textSecondary !== '' ? (
              <Text
                style={Fonts.style.regular(
                  Colors.gray,
                  Fonts.size.small,
                  'left',
                )}>
                {textSecondary}
              </Text>
            ) : null}
          </>
        ) : (
          <Text
            style={Fonts.style.regular(Colors.dark, Fonts.size.small, 'left')}>
            {textInactive}
          </Text>
        )}
      </View>
    </View>
  );
};
