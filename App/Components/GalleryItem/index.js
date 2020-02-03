/**
 * Sample React Native App with Firebase
 * https://github.com/invertase/react-native-firebase
 *
 * @format
 * @flow
 */
import React, {Component, useContext, useEffect} from 'react';
import {View, Image, Text, TouchableOpacity} from 'react-native';

import styles from './styles';
import {Metrics, ApplicationStyles, Images, Fonts, Colors} from '../../Themes';
import FastImage from 'react-native-fast-image';
import StarRating from 'react-native-star-rating';
import moment from 'moment';

export default data => {
  const {item} = data;
  return (
    <View
      style={{
        width: Metrics.screenWidth,
      }}>
      <View
        style={{
          width: Metrics.screenWidth * 0.9,
          justifyContent: 'flex-start',
          alignItems: 'center',
          alignSelf: 'center',
          flexDirection: 'row',
          paddingVertical: 5,
        }}>
        <FastImage
          source={{uri: item.expertImage}}
          style={{width: 50, height: 50, borderRadius: 20, marginRight: 10}}
        />
        <View>
          <Text
            style={Fonts.style.regular(Colors.dark, Fonts.size.small, 'left')}>
            Experta: {item.expertName} Cliente: {item.clientName}
          </Text>

          <Text
            style={Fonts.style.regular(Colors.dark, Fonts.size.small, 'left')}>
            Servicio: {item.service}
          </Text>

          <Text
            style={Fonts.style.regular(Colors.dark, Fonts.size.tiny, 'left')}>
            {moment(item.date).format('LL')}
          </Text>
        </View>
      </View>
      <FastImage
        source={{uri: item.imageUrl}}
        style={{
          width: Metrics.screenWidth * 0.9,
          height: Metrics.screenWidth * 0.9,
          alignSelf: 'center',
          // borderColor: 'red',
          marginHorizontal: 20,
          borderRadius: Metrics.borderRadius,
        }}
      />
      <View
        style={{
          marginVertical: 10,
          width: 40,
          alignSelf: 'center',
          height: 1,
          backgroundColor: Colors.lightGray,
        }}
      />
    </View>
  );
};
