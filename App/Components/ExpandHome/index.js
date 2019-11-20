/**
 * Sample React Native App with Firebase
 * https://github.com/invertase/react-native-firebase
 *
 * @format
 * @flow
 */
import React from 'react';
import {View, Image, Text, TouchableOpacity, Animated} from 'react-native';

import styles from './styles';
import {ApplicationStyles, Colors, Fonts, Images, Metrics} from '../../Themes';
import FastImage from 'react-native-fast-image';
import Utilities from '../../Utilities';
import _ from 'lodash';

export default dta => {
  const [expanded, onChangeExpanded] = React.useState(true);
  const [animation, onChangeanimation] = React.useState(new Animated.Value(0));
  const [animationItem, onChangeanimationItem] = React.useState(
    new Animated.Value(0),
  );

  const [opacity, onChangeOpacity] = React.useState(new Animated.Value(0));

  const {data} = dta;
  const {products, addOns} = data;
  const itemHeight = 80;

  return (
    <Animated.View style={[styles.container]}>
      <TouchableOpacity
        onPress={() => {
          duration = 250;
          let toHeight =
            itemHeight * (products && products.length ? products.length : 50);

          Animated.timing(animation, {
            toValue: expanded ? toHeight : 0,
            duration,
          }).start();

          Animated.timing(animationItem, {
            toValue: expanded ? itemHeight : 0,
            duration,
          }).start();

          Animated.timing(opacity, {
            toValue: expanded ? 100 : 0,
            duration,
          }).start();

          onChangeExpanded(expanded ? false : true);
        }}
        activeOpacity={0.8}
        style={[
          ApplicationStyles.itemService,
          ApplicationStyles.shadownClient,
        ]}>
        <FastImage
          style={ApplicationStyles.itemImage}
          source={{
            uri: data.imageUrl,
            priority: FastImage.priority.normal,
          }}
          resizeMode={FastImage.resizeMode.cover}
        />
        <View //Item Service
          style={[ApplicationStyles.itemTextContainer]}>
          <Text
            style={[
              Fonts.style.bold(Colors.light, Fonts.size.bigTitle, 'center'),
              ApplicationStyles.shadownClient,
            ]}>
            {data.name.toUpperCase()}
          </Text>
        </View>
      </TouchableOpacity>
      <Animated.View
        style={[
          {
            width: '100%',
            // flex: 0
            // padding: 10,
            // paddingTop: 0
          },
          {height: animation},
        ]}>
        {products &&
          products.length > 0 &&
          products.map((product, index) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  const result = _.filter(
                    addOns,
                    o => o.idProduct == product.id,
                  );

                  dta.selectService({...product, addOns: result});
                }}
                key={index}>
                {index != 0 && (
                  <Animated.View
                    opacity={opacity}
                    style={{
                      width: '95%',
                      height: 1,
                      alignSelf: 'center',
                      backgroundColor: 'rgba(0,0,0,0.05)',
                    }}></Animated.View>
                )}
                <Animated.View
                  opacity={opacity}
                  data={data}
                  style={{
                    // width: Metrics.screenWidth * 0.95,
                    height: animationItem,
                    alignItems: 'center',
                    flexDirection: 'row',
                    // backgroundColor: Colors.light
                  }}
                  image={{uri: data.imageUrl}}>
                  <View style={{flex: 1, marginHorizontal: 10}}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        // backgroundColor: 'red'
                      }}>
                      <Text
                        style={Fonts.style.semiBold(
                          Colors.dark,
                          Fonts.size.medium,
                          'left',
                        )}>
                        {product.name.toUpperCase()}
                      </Text>
                    </View>
                    <View>
                      <Text
                        style={Fonts.style.regular(
                          Colors.gray,
                          Fonts.size.medium,
                          'left',
                        )}>
                        {product.shortDescription}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      // width: 20,
                      height: 80,
                      resizeMode: 'cover',
                      margin: 5,
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'row',
                    }}>
                    <Text
                      style={Fonts.style.bold(
                        Colors.dark,
                        Fonts.size.medium,
                        'left',
                      )}>
                      {Utilities.formatCOP(product.price)}
                    </Text>
                    <Image
                      source={Images.next}
                      style={{
                        width: 10,
                        height: 10,
                        marginLeft: 5,
                        tintColor: Colors.dark,
                        resizeMode: 'contain',
                      }}></Image>
                  </View>
                </Animated.View>
              </TouchableOpacity>
            );
          })}
      </Animated.View>
    </Animated.View>
  );
};
