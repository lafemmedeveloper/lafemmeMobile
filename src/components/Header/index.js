import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

import styles from './styles';
import {ApplicationStyles, Fonts, Colors} from 'App/themes';

export default (data) => {
  const {selectAddress} = data;

  return (
    <View style={[styles.container, ApplicationStyles.shadownClient]}>
      <View style={styles.addHeader}>{/*  */}</View>
      <View style={[styles.content]}>
        <View
          style={[
            styles.contentC,
            ApplicationStyles.centerContent,
            {flexDirection: 'row'},s
          ]}>
          {data.user &&
          data.user.cart &&
          data.user.cart.address &&
          data.user.cart.address.name ? (
            <TouchableOpacity
              style={{alignItems: 'center', justifyContent: 'center'}}
              onPress={() => {
                selectAddress();
              }}>
              <Text
                numberOfLines={2}
                style={[
                  Fonts.style.regular(
                    Colors.client.primaryColor,
                    Fonts.size.medium,
                    'center',
                  ),
                  {marginHorizontal: 20},
                ]}>
                <Icon
                  name="sort-down"
                  size={Fonts.size.medium}
                  color={Colors.client.primaryColor}
                />{' '}
                {data.user.cart.address.type !== 3 && (
                  <Text
                    numberOfLines={2}
                    style={[
                      Fonts.style.regular(
                        Colors.client.primaryColor,
                        Fonts.size.medium,
                        'center',
                      ),
                      {marginHorizontal: 20},
                    ]}>
                    {data.user.cart.address.formattedAddress}
                  </Text>
                )}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={{alignItems: 'center', justifyContent: 'center'}}
              onPress={() => {
                selectAddress();
              }}>
              <Text
                style={Fonts.style.regular(
                  Colors.client.primaryColor,
                  Fonts.size.medium,
                  'center',
                )}>
                {data.title}
                {
                  <Icon
                    name="sort-down"
                    size={Fonts.size.medium}
                    color={Colors.light}
                  />
                }
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};
