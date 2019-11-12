/**
 * Sample React Native App with Firebase
 * https://github.com/invertase/react-native-firebase
 *
 * @format
 * @flow
 */
import React, {Component, useContext, useEffect} from 'react';
import {View, Image, Text, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from './styles';
import {Metrics, ApplicationStyles, Images, Fonts, Colors} from '../../Themes';

export default data => {
  return (
    <View style={styles.container}>
      <Image
        style={[
          {
            width: Metrics.screenWidth,
            height: 200,
            position: 'absolute',
            resizeMode: 'cover',
            backgroundColor: 'transparent',
            tintColor: data.isExpert
              ? Colors.expert.secondaryColor
              : Colors.client.secondaryColor,
          },

          ApplicationStyles.imageshadownClient,
        ]}
        source={Images.headerSmall}
      />
      <View style={styles.addHeader}>{/*  */}</View>
      <View style={[styles.content]}>
        <TouchableOpacity
          onPress={() => {
            if (data.iconL) {
              console.log('onActionL');
              data.onActionL();
            }
          }}
          style={[styles.contentL, ApplicationStyles.centerContent]}>
          <Image style={styles.icon} source={data.iconL}></Image>
        </TouchableOpacity>
        <View style={[styles.contentC, ApplicationStyles.centerContent]}>
          <Text
            style={Fonts.style.bold(Colors.light, Fonts.size.medium, 'center')}>
            {data.title.toUpperCase()}{' '}
            {<Icon name="sort-down" size={24} color={Colors.light} />}
          </Text>
          {!data.isExpert && (
            <TouchableOpacity
              onPress={() => {
                console.log('selectAddress');
                data.selectAddress();
              }}
              style={{flexDirection: 'row'}}>
              {/* {user && user.selectedAddress ? (
                <Text style={Fonts.style.regular(Colors.light, Fonts.size.small, 'center')}>
                  {'Calle 64 #50-40, Medellin-Colombia'}
                </Text>
              ) : (
                <Text style={Fonts.style.regular(Colors.light, Fonts.size.small, 'center')}>
                  {'Agrega o selecciona una dirección'}
                </Text>
              )} */}
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          onPress={() => {
            if (data.iconR) {
              console.log('onActionR');
              data.onActionR();
            }
          }}
          style={[styles.contentR, ApplicationStyles.centerContent]}>
          <Image style={styles.icon} source={data.iconR}></Image>
        </TouchableOpacity>
      </View>
      <View style={styles.footerHeader}>{/*  */}</View>
    </View>
  );
};
