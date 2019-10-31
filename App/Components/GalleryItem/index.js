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

export default data => {
  const {item} = data;
  return (
    <View
      style={{
        width: Metrics.screenWidth / 2,
      }}>
      <FastImage
        source={{uri: item.src}}
        style={{
          width: Metrics.screenWidth / 2 - 10,
          height: Metrics.screenWidth / 2 - 10,
          borderWidth: 1,
          alignSelf: 'center',
          // borderColor: 'red',
          marginHorizontal: 20,
        }}
      />
      <FastImage
        source={{uri: item.expertImage}}
        style={{width: 30, height: 30, borderRadius: 15}}
      />
      <Text style={{alignSelf: 'center'}}>{item.date}</Text>
      <Text style={{alignSelf: 'center'}}>{item.expertName}</Text>
      <View style={{width: 100}}>
        <StarRating
          disabled={true}
          maxStars={5}
          rating={item.rating ? item.rating : 5}
          starSize={15}
          // selectedStar={(rating) => }
        />
      </View>
    </View>
  );
};
