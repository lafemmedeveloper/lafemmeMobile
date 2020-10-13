import React, {useContext, useEffect, useState} from 'react';
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
import {Colors, Fonts, Images, Metrics} from '../../../../themes';
import utilities from '../../../../utilities';
import _ from 'lodash';
import {useNavigation} from '@react-navigation/native';

const ServiceModal = ({order, close}) => {
  const navigation = useNavigation();
  const {state, serviceDispatch} = useContext(StoreContext);
  const {service} = state;

  console.log('state service', service.service);
  console.log('state slug ==>', order.servicesType.join());

  const [serviceCurrent, setServiceCurrent] = useState(null);
  const [products, setProducts] = useState([]);
  const [addOns, setAddons] = useState([]);

  useEffect(() => {
    getService(order.servicesType, serviceDispatch);
  }, [serviceDispatch, order.servicesType]);

  useEffect(() => {
    if (service.service && service.service.length > 0) {
      setServiceCurrent(service.service[0]);
      setProducts(service.service[0].products);
      setAddons(service.service[0].addOns);
    }
  }, [service]);

  const activeDetailModal = (product) => {
    close();
    navigation.navigate('DetailProduct', {product});
  };

  return (
    <View style={styles.container}>
      <Text
        style={[
          Fonts.style.bold(Colors.dark, Fonts.size.h4),
          {alignSelf: 'center'},
        ]}>
        Editar la orden de tu cliente
      </Text>

      <ScrollView>
        <Text
          style={[
            Fonts.style.bold(Colors.dark, Fonts.size.h6),
            {alignSelf: 'flex-start', marginLeft: 10, marginTop: 20},
          ]}>
          Products
        </Text>
        <View>
          {products.length > 0 &&
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
                    image={{uri: product.imageUrl}}>
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
                          source={{uri: product.imageUrl}}
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
            })}
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
