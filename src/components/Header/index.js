import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {ApplicationStyles, Fonts, Metrics, Colors} from '../../themes';

export default ({selectAddress, user, title, children}) => {
  return (
    <View style={[styles.container, ApplicationStyles.shadowsClient]}>
      <View style={styles.content}>
        <View
          style={[
            styles.contentC,
            ApplicationStyles.centerContent,
            {flexDirection: 'row'},
          ]}>
          {user && user.cart && user.cart.address && user.cart.address.name ? (
            <TouchableOpacity
              style={{alignItems: 'center', justifyContent: 'center'}}
              onPress={() => selectAddress()}>
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
                {user.cart.address.type !== 3 && (
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
                    {user.cart.address.formattedAddress}
                  </Text>
                )}
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={{flexDirection: 'column', flex: 1}}>
              <TouchableOpacity
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={() => selectAddress()}>
                <Text
                  style={Fonts.style.regular(
                    Colors.client.primaryColor,
                    Fonts.size.medium,
                    'center',
                  )}>
                  {title}
                  {
                    <Icon
                      name="sort-down"
                      size={Fonts.size.medium}
                      color={Colors.light}
                    />
                  }
                </Text>
              </TouchableOpacity>
              {children && children}
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: Metrics.screenWidth,
    paddingTop: Metrics.addHeader,
    flex: 0,
    // paddingVertical: 10,
    // position: 'absolute',
    zIndex: 100,
    height: 60 + Metrics.addHeader,
    backgroundColor: Colors.backgroundColor,
    shadowColor: Colors.client.primaryColors,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  content: {
    width: Metrics.screenWidth,
    flex: 1,
    flexDirection: 'row',
  },
  contentC: {
    flex: 1,
    alignItems: 'center',
  },
});
