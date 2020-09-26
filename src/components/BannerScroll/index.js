import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';

import styles from './styles';
import {ApplicationStyles, Colors, Fonts} from '../../themes';
import FastImage from 'react-native-fast-image';

export default (data) => {
  return (
    <View style={[styles.container]}>
      <TouchableOpacity
        onPress={() => {
          data.selectBanner();
        }}
        activeOpacity={0.8}
        style={[
          ApplicationStyles.itemService,
          ApplicationStyles.shadowsClient,
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
              ApplicationStyles.shadowsClient,
            ]}>
            {data.name.toUpperCase()}
          </Text>
          <Text
            style={[
              Fonts.style.bold(Colors.light, Fonts.size.small, 'center'),
              ApplicationStyles.shadowsClient,
            ]}>
            {data.subtitle}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};
