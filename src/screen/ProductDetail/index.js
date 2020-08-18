import React from 'react';
import {View, TouchableOpacity, ScrollView} from 'react-native';
import FastImage from 'react-native-fast-image';
import styles from './styles';
import {Metrics, Colors, ApplicationStyles} from 'App/themes';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Cart from './Cart';

const ProductDetail = (props) => {
  const {route, navigation} = props;
  const {goBack} = navigation;
  const {params} = route;
  const {product, authDispatch} = params;

  return (
    <>
      <View
        style={{
          height: 40 + Metrics.addHeader,
          paddingTop: Metrics.addHeader,
          width: Metrics.screenWidth,
          justifyContent: 'center',
          zIndex: 2000,
          position: 'absolute',
          opacity: 0.8,
        }}>
        <TouchableOpacity onPress={() => goBack()}>
          <View style={styles.containerBack}>
            <Icon
              name={'chevron-left'}
              size={20}
              color={Colors.dark}
              style={{
                alignSelf: 'center',
              }}
            />
          </View>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.container}>
        <View style={[styles.header, ApplicationStyles.shadownClient]}>
          <FastImage
            style={styles.imageProduct}
            source={{
              uri: product.imageUrl,
              priority: FastImage.priority.normal,
            }}
            resizeMode={FastImage.resizeMode.cover}
          />
        </View>
        <Cart product={product} dispatch={authDispatch} />
      </ScrollView>
    </>
  );
};

export default ProductDetail;
