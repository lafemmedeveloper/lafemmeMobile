import React from 'react';
import {View, Image, Text, TouchableOpacity, Animated} from 'react-native';

import styles from './styles';
import {ApplicationStyles, Colors, Fonts, Images, Metrics} from '../../themes';
import FastImage from 'react-native-fast-image';
import Utilities from '../../utilities';
import _ from 'lodash';

export default (dta) => {
  const [expanded, onChangeExpanded] = React.useState(true);
  const [animation, onChangeanimation] = React.useState(new Animated.Value(0));
  const [animationItem, onChangeanimationItem] = React.useState(
    new Animated.Value(0),
  );

  const [opacity, onChangeOpacity] = React.useState(new Animated.Value(0));

  const {data} = dta;
  const {products, addOns} = data;

  let sortedProduct = _.sortBy(products, 'order');
  const itemHeight = 80;

  console.log(
    'these variables are not being used==>',
    onChangeOpacity,
    onChangeanimationItem,
    onChangeanimation,
  );
  let productFilter = sortedProduct.filter((p) => p.isEnabled === true);

  return (
    <Animated.View style={[styles.container]}>
      <TouchableOpacity
        onPress={() => {
          let duration = 250;
          let toHeight =
            itemHeight *
            (productFilter && productFilter.length ? productFilter.length : 50);

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
          {zIndex: 150},
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
              Fonts.style.bold(Colors.light, Fonts.size.h3, 'center'),
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
            zIndex: 100,
          },
          {height: animation},
        ]}>
        {productFilter &&
          productFilter.length > 0 &&
          productFilter.map((product, index) => {
            return (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  const result = _.filter(
                    addOns,
                    (o) => o.idProduct === product.id,
                  );

                  dta.selectService({...product, addOns: result});
                }}>
                {index !== 0 && (
                  <Animated.View
                    opacity={opacity}
                    style={{
                      width: '95%',
                      height: 1,
                      alignSelf: 'center',
                      backgroundColor: 'rgba(0,0,0,0.05)',
                    }}
                  />
                )}
                <Animated.View
                  opacity={opacity}
                  data={data}
                  style={{
                    height: animationItem,
                    alignItems: 'center',
                    flexDirection: 'row',
                  }}
                  image={{uri: data.imageUrl}}>
                  <View
                    style={{
                      height: 80,
                      resizeMode: 'cover',
                      margin: 5,
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'row',
                    }}>
                    <Animated.View
                      opacity={opacity}
                      style={{
                        width: 60,
                        height: 60,
                      }}>
                      <FastImage
                        source={{uri: product.imageUrl}}
                        style={{
                          width: 60,
                          height: 60,
                          borderRadius: Metrics.borderRadius,
                          resizeMode: 'cover',
                        }}
                      />
                    </Animated.View>
                  </View>
                  <View style={{flex: 1, marginHorizontal: 10}}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
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
                        numberOfLines={2}
                        ellipsizeMode="tail"
                        style={Fonts.style.light(
                          Colors.dark,
                          Fonts.size.medium,
                          'left',
                        )}>
                        {product.shortDescription}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
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
                      }}
                    />
                  </View>
                </Animated.View>
              </TouchableOpacity>
            );
          })}
      </Animated.View>
    </Animated.View>
  );
};
