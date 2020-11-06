import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {StoreContext} from '../../../../flux';
import {getService} from '../../../../flux/services/actions';
import {
  ApplicationStyles,
  Colors,
  Fonts,
  Images,
  Metrics,
} from '../../../../themes';
import utilities from '../../../../utilities';
import _ from 'lodash';
import {useNavigation} from '@react-navigation/native';

const ServiceModal = ({order, close, itemService}) => {
  const isMountedRef = useRef(null);
  const navigation = useNavigation();

  const {state, serviceDispatch} = useContext(StoreContext);
  const {service} = state;

  const [products, setProducts] = useState([]);
  const [addOns, setAddons] = useState([]);

  const activeDetailModal = (product) => {
    close();
    navigation.navigate('DetailProduct', {product});
  };

  useEffect(() => {
    isMountedRef.current = true;

    getService(itemService.servicesType, serviceDispatch);

    return () => {
      return () => (isMountedRef.current = false);
    };
  }, [serviceDispatch, itemService.servicesType]);

  useEffect(() => {
    if (service && service.service && service.service.length > 0) {
      setProducts(service.service[0].products);
      setAddons(service.service[0].addOns);
    }
  }, [service, service.service]);

  return (
    <View style={styles.container}>
      <View opacity={0.0} style={ApplicationStyles.separatorLineMini} />

      <Image
        source={Images.edit}
        style={{
          width: 50,
          height: 50,
          resizeMode: 'contain',
          alignSelf: 'center',
          marginBottom: 10,
          tintColor: Colors.expert.primaryColor,
        }}
      />
      <Text style={Fonts.style.bold(Colors.dark, Fonts.size.h6, 'center')}>
        {'Editar orden'}
      </Text>

      <Text style={Fonts.style.light(Colors.data, Fonts.size.small, 'center')}>
        {'Elige el producto que quieres editar'}
      </Text>
      <View opacity={0.0} style={ApplicationStyles.separatorLineMini} />

      <ScrollView>
        <Text
          style={[
            Fonts.style.bold(Colors.dark, Fonts.size.h6),
            {alignSelf: 'flex-start', marginLeft: 10, marginTop: 20},
          ]}>
          Productos
        </Text>
        <View>
          {products && products.length > 0 ? (
            products.map((product, index) => {
              return (
                <TouchableOpacity
                  key={product.id}
                  onPress={() => {
                    const result = _.filter(
                      addOns,
                      (o) => o.idProduct === product.id,
                    );

                    activeDetailModal({
                      ...product,
                      addOns: result,
                      slug: order.servicesType,
                      order,
                    });
                  }}>
                  {index !== 0 && (
                    <View
                      style={{
                        width: '95%',
                        height: 1,
                        alignSelf: 'center',
                        backgroundColor: 'rgba(0,0,0,0.05)',
                      }}
                    />
                  )}
                  <View
                    style={{
                      height: 100,
                      alignItems: 'center',
                      flexDirection: 'row',
                    }}
                    image={{uri: product.imageUrl.medium}}>
                    <View
                      style={{
                        height: 80,
                        resizeMode: 'cover',
                        margin: 5,
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'row',
                      }}>
                      <View
                        style={{
                          width: 60,
                          height: 60,
                        }}>
                        <FastImage
                          source={{uri: product.imageUrl.medium}}
                          style={{
                            width: 60,
                            height: 60,
                            borderRadius: Metrics.borderRadius,
                            resizeMode: 'cover',
                          }}
                        />
                      </View>
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
                          {product.description}
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
                        {utilities.formatCOP(product.price)}
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
                  </View>
                </TouchableOpacity>
              );
            })
          ) : (
            <Text
              style={[
                Fonts.style.bold(Colors.dark, Fonts.size.medium, 'left'),
                {marginLeft: 20, marginTop: 40},
              ]}>
              Este servicio ya no tiene productos disponibles
            </Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    height: Metrics.screenHeight - 60,
    paddingTop: 20,
  },
});
export default ServiceModal;
