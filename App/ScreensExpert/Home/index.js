/**
 * Sample React Native App with Firebase
 * https://github.com/invertase/react-native-firebase
 *
 * @format
 * @flow
 */

import React, {Component, useContext, useEffect} from 'react';
import {
  Platform,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
} from 'react-native';

import {Colors, Fonts, Images, Metrics, ApplicationStyles} from '../../Themes';
import {msToDate} from '../../Helpers/MomentHelper';
import {getDistance, getCurrentLocation} from '../../Helpers/GeoHelper';

import Header from '../../Components/Header';
import ExpandHome from '../../Components/ExpandHome';
import styles from './styles';

export default function Home({navigation}) {
  function logout() {}

  function actionL() {
    console.log('actionL');
  }

  function actionR() {
    console.log('actionR');
  }
  function selectAddress() {
    console.log('selectAddress');
  }
  function selectService(item) {
    console.log('selectService', item);
    // StatusBar.setBarStyle('dark-content', false);

    navigation.navigate('ProductDetail', {product: item});
  }

  console.log('getCurrentLocation', getCurrentLocation());
  return (
    <View style={styles.container}>
      <Header
        title={'Inicio'}
        iconL={Images.menu}
        iconR={Images.alarm}
        isExpert={true}
        // tintColor={Colors.expert.secondaryColor}
        selectAddress={() => selectAddress()}
        onActionL={() => actionL()}
        onActionR={() => actionR()}
      />
      <View
        style={[
          ApplicationStyles.scrollHomeExpert,
          ApplicationStyles.shadownExpert,
        ]}>
        <ScrollView style={{flex: 1}} bounces={false}>
          {orders &&
            orders.map(data => {
              return (
                <View key={data.id} style={{marginVertical: 10}}>
                  <Text
                    style={Fonts.style.regular(
                      Colors.dark,
                      Fonts.size.small,
                      'center',
                    )}>
                    {data.userComments}
                  </Text>
                  <Text
                    style={Fonts.style.regular(
                      Colors.dark,
                      Fonts.size.small,
                      'center',
                    )}>
                    msToDate(data.dateService.startDate._seconds)
                  </Text>
                  <Text
                    style={Fonts.style.regular(
                      Colors.dark,
                      Fonts.size.small,
                      'center',
                    )}>
                    msToDate(data.dateService.endDate._seconds)
                  </Text>
                  <Text
                    style={Fonts.style.regular(
                      Colors.dark,
                      Fonts.size.small,
                      'center',
                    )}>
                    {data.location.address}
                  </Text>

                  <Text
                    style={Fonts.style.regular(
                      Colors.dark,
                      Fonts.size.small,
                      'center',
                    )}>
                    status: {data.status}
                  </Text>

                  <Text
                    style={Fonts.style.regular(
                      Colors.dark,
                      Fonts.size.small,
                      'center',
                    )}>
                    {getDistance(
                      {
                        latitude: data.location.coordinates.latitude,
                        longitude: data.location.coordinates.longitude,
                      },
                      {latitude: "51° 31' N", longitude: "7° 28' E"},
                    )}
                  </Text>
                </View>
              );
            })}

          <Text
            style={Fonts.style.regular(
              Colors.dark,
              Fonts.size.small,
              'center',
            )}>
            {'Home View Expert'}
          </Text>
          <Text
            style={Fonts.style.regular(
              Colors.dark,
              Fonts.size.small,
              'center',
            )}>
            {' name:'} {user.fullName}
          </Text>
          <Text
            style={Fonts.style.regular(
              Colors.dark,
              Fonts.size.small,
              'center',
            )}>
            {'email'} {user.email}
          </Text>
          <Text
            style={Fonts.style.regular(
              Colors.dark,
              Fonts.size.small,
              'center',
            )}>
            {'bundleId:'} {deviceInfo.bundleId}
          </Text>
          <Text
            style={Fonts.style.regular(
              Colors.dark,
              Fonts.size.small,
              'center',
            )}>
            {'readableVersion:'} {deviceInfo.readableVersion}
          </Text>
          <Text
            style={Fonts.style.regular(
              Colors.dark,
              Fonts.size.small,
              'center',
            )}>
            {'uid:'} {user.uid}
          </Text>
          <TouchableOpacity onPress={logout}>
            <Text
              style={Fonts.style.bold(Colors.dark, Fonts.size.h6, 'center')}>
              logout
            </Text>
          </TouchableOpacity>
          <View style={{height: 20}}></View>
        </ScrollView>
      </View>
    </View>
  );
}
