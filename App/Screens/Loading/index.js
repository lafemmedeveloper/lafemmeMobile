/**
 * Sample React Native App with Firebase
 * https://github.com/invertase/react-native-firebase
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {
  Platform,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
  TextInput,
} from 'react-native';

import {Colors, Fonts, Images, Metrics, ApplicationStyles} from '../../Themes';

import styles from './styles';
import auth from '@react-native-firebase/auth';

export default function Loading({navigation}) {
  return (
    <View style={styles.container}>
      <ScrollView style={ApplicationStyles.scrollHome}>
        <Text style={Fonts.style.bold(Colors.dark, Fonts.size.h6, 'center')}>
          {'Loading View'}
        </Text>
      </ScrollView>
    </View>
  );
}
