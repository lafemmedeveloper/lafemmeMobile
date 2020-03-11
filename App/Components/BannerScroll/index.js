/**
 * Sample React Native App with Firebase
 * https://github.com/invertase/react-native-firebase
 *
 * @format
 * @flow
 */
import React from 'react';
import {View, Image, Text, TouchableOpacity} from 'react-native';

import styles from './styles';
import {ApplicationStyles, Colors, Fonts, Images, Metrics} from '../../Themes';
import FastImage from 'react-native-fast-image';

import _ from 'lodash';

export default data => {
  return (
    <View style={[styles.container]}>
      <TouchableOpacity
        onPress={() => {
          data.selectBanner();
        }}
        activeOpacity={0.8}
        style={[
          ApplicationStyles.itemService,
          ApplicationStyles.shadownClient,
        ]}>
        <FastImage
          style={ApplicationStyles.itemImage}
          source={data.image}
          resizeMode={FastImage.resizeMode.cover}
        />
        <View //Item Service
          style={[ApplicationStyles.itemTextContainer]}>
          <Text
            style={[
              Fonts.style.bold(Colors.light, Fonts.size.bigTitle, 'center'),
              ApplicationStyles.shadownClient,
            ]}>
            {data.name.toUpperCase()}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};
