/**
 * Sample React Native App with Firebase
 * https://github.com/invertase/react-native-firebase
 *
 * @format
 * @flow
 */
import React, {Component, useContext, useEffect} from 'react';
import {View, Image, Text, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import LinearGradient from 'react-native-linear-gradient';
import styles from './styles';
import {Metrics, ApplicationStyles, Images, Fonts, Colors} from '../../Themes';
import AppConfig from '../../Config/AppConfig';

export default data => {
  const {appType} = data;
  return (
    <View style={[styles.container, ApplicationStyles.shadownClient]}>
      {/* <LinearGradient
        useAngle={true}
        angle={45}
        style={[
          data.isExpert ? styles.imageHeaderExpert : styles.imageHeader,
          ApplicationStyles.imageshadownClient,
        ]}
        colors={[Colors[appType].primartColor, Colors[appType].secondaryColor]}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}} /> */}
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
          <Image style={styles.icon} source={data.iconL} />
        </TouchableOpacity>
        <View
          style={[
            styles.contentC,
            ApplicationStyles.centerContent,
            {flexDirection: 'row'},
          ]}>
          {data.user &&
          data.user.cart &&
          data.user.cart.address &&
          data.user.cart.address.name ? (
            <>
              <Icon
                name="sort-down"
                size={Fonts.size.medium}
                color={Colors[appType].primartColor}
              />
              <Text
                numberOfLines={2}
                style={[
                  Fonts.style.regular(
                    Colors[appType].primartColor,
                    Fonts.size.medium,
                    'center',
                  ),
                  {marginHorizontal: 20},
                ]}>
                {data.user.cart.address.name}
                {'\n'}

                {data.user.cart.address.type !== 3 && (
                  <Text
                    numberOfLines={2}
                    style={[
                      Fonts.style.bold(
                        Colors[appType].primartColor,
                        Fonts.size.medium,
                        'center',
                      ),
                      {marginHorizontal: 20},
                    ]}>
                    {AppConfig.locationIcon[data.user.cart.address.type]}
                  </Text>
                )}
              </Text>
            </>
          ) : (
            <Text
              style={Fonts.style.regular(
                Colors[appType].primartColor,
                Fonts.size.medium,
                'center',
              )}>
              {data.title}{' '}
              {
                <Icon
                  name="sort-down"
                  size={Fonts.size.medium}
                  color={Colors.light}
                />
              }
            </Text>
          )}
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
                  {'Agrega o selecciona una ddireccion'}
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
          <Icon
            name={data.iconR}
            size={24}
            color={Colors[appType].primartColor}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};
