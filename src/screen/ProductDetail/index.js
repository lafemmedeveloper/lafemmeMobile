import React, {useContext, useEffect} from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {Metrics, Colors} from '../../themes';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Cart from './Cart';
import {productViewAddress} from '../../flux/util/actions';
import {StoreContext} from '../../flux';

const ProductDetail = (props) => {
  const {route, navigation} = props;
  const {goBack} = navigation;
  const {params} = route;
  const {product, generalDescription, authDispatch} = params;

  const {utilDispatch, state} = useContext(StoreContext);
  const {util} = state;
  const {productView} = util;

  useEffect(() => {
    if (productView.view) {
      productViewAddress(null, false, utilDispatch);
    }
  }, [productView.view, utilDispatch]);

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
      <View style={styles.container}>
        <Cart
          product={product}
          generalDescription={generalDescription}
          dispatch={authDispatch}
        />
      </View>
    </>
  );
};

export default ProductDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: Metrics.screenWidth,
    height: Metrics.screenHeight,
  },
  imageProduct: {
    width: Metrics.screenWidth,
    height: Metrics.screenWidth / 1.5,
    resizeMode: 'cover',
  },
  containerBack: {
    marginLeft: 20,
    backgroundColor: 'white',
    height: 30,
    width: 30,
    flex: 0,
    borderRadius: 15,
    justifyContent: 'center',
    marginTop: 20,
  },
  contImage: {
    width: Metrics.screenWidth,
    height: Metrics.screenWidth / 1.5,
    resizeMode: 'cover',
    position: 'absolute',
    bottom: 10,
    justifyContent: 'flex-end',
    marginHorizontal: 10,
  },
  header: {
    zIndex: 1000,
    width: Metrics.screenWidth,
    height: Metrics.screenWidth / 1.5,
    resizeMode: 'cover',
  },
  borrar: {},
});
