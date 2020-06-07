/**
 * Sample React Native App with Firebase
 * https://github.com/invertase/react-native-firebase
 *
 * @format
 * @flow
 */
import React, {Component, useState} from 'react';
import {View, Image, Text, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import LinearGradient from 'react-native-linear-gradient';
import styles from './styles';
import {Metrics, ApplicationStyles, Images, Fonts, Colors} from '../../Themes';
import AppConfig from '../../Config/AppConfig';

export default data => {
  const {appType, menuIndex, onAction} = data;

  return (
    <View style={[styles.container, ApplicationStyles.shadownClient]}>
      <View style={styles.addHeader}>{/*  */}</View>
      <View style={[styles.content]}>
        <View
          style={[
            styles.contentC,
            ApplicationStyles.centerContent,
            {flexDirection: 'row'},
          ]}>
          <Text
            style={Fonts.style.regular(
              Colors.gray,
              Fonts.size.medium,
              'center',
            )}>
            Mi Balance{'\n'}
          </Text>
        </View>
      </View>
      <View style={[styles.contentBtn]}>
        <TouchableOpacity
          onPress={() => {
            onAction(0);
          }}
          style={styles.itemBtn}>
          <Text
            style={Fonts.style.bold(Colors.dark, Fonts.size.medium, 'center')}>
            {'Activas'}
          </Text>
          <View
            style={[
              styles.itemMenu,
              // eslint-disable-next-line react-native/no-inline-styles
              {
                height: menuIndex === 0 ? 3 : 0,
              },
            ]}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            onAction(1);
          }}
          style={styles.itemBtn}>
          <Text
            style={Fonts.style.bold(Colors.dark, Fonts.size.medium, 'center')}>
            {'Historial'}
          </Text>
          <View
            style={[
              styles.itemMenu,
              // eslint-disable-next-line react-native/no-inline-styles
              {
                height: menuIndex === 1 ? 3 : 0,
              },
            ]}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};
