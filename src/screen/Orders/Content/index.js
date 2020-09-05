import React, {useContext, useState} from 'react';
import {Text, View, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {
  Fonts,
  Colors,
  Images,
  ApplicationStyles,
  Metrics,
} from '../../../themes';
import {StoreContext} from '../../../flux';
import {ScrollView} from 'react-native-gesture-handler';
import ExpandOrderData from '../../ExpandOrderData';
import ExpandHistoryData from '../../ExpandHistoryData';

const Content = () => {
  const {state /*  serviceDispatch, authDispatch */} = useContext(StoreContext);

  const {auth, util} = state;

  const {user} = auth;
  const {orders, history} = util;

  const [toggleType, settoggleType] = useState(0);

  console.log('orders ==> Content', orders);
  const cancelOrder = () => {
    console.log('cancel ordeer');
  };
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View opacity={0.0} style={ApplicationStyles.separatorLine} />
        <Image
          source={Images.billResume}
          style={{
            width: 40,
            height: 40,
            resizeMode: 'contain',
            alignSelf: 'center',
            marginBottom: 10,
          }}
        />
        <Text
          style={[
            Fonts.style.semiBold(Colors.dark, Fonts.size.h6, 'center'),
            {marginBottom: 10},
          ]}>
          {'Mis servicios'}
        </Text>
      </View>
      <View
        style={{
          width: Metrics.screenWidth * 0.9,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignSelf: 'center',
        }}>
        <TouchableOpacity
          onPress={() => settoggleType(0)}
          style={[
            styles.headerBtn,
            {
              backgroundColor:
                toggleType === 0
                  ? Colors.client.primaryColor
                  : Colors.disabledBtn,
            },
          ]}>
          <Text
            style={Fonts.style.semiBold(
              toggleType === 0 ? Colors.light : Colors.dark,
              Fonts.size.medium,
              'center',
            )}>
            {'Próximos Servicios'}
          </Text>
        </TouchableOpacity>
        <View style={{width: 5}} />
        <TouchableOpacity
          onPress={() => settoggleType(1)}
          style={[
            styles.headerBtn,
            {
              backgroundColor:
                toggleType === 1
                  ? Colors.client.primaryColor
                  : Colors.disabledBtn,
            },
          ]}>
          <Text
            style={Fonts.style.semiBold(
              toggleType === 1 ? Colors.light : Colors.dark,
              Fonts.size.medium,
              'center',
            )}>
            {'Historial'}
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.contentContainer}>
        {toggleType === 0 &&
          orders.map((item, index) => {
            return (
              <View key={item.id}>
                <ExpandOrderData
                  user={user}
                  order={item}
                  cancelOrder={(orderId) => cancelOrder(orderId)}
                />

                {index < orders.length - 1 && (
                  <View opacity={0.0} style={ApplicationStyles.separatorLine} />
                )}
              </View>
            );
          })}
        {toggleType === 1 &&
          history.map((item) => {
            return (
              <View key={item.id}>
                <ExpandHistoryData order={item} appType={'client'} />
              </View>
            );
          })}

        {toggleType === 0 && orders.length === 0 && (
          <View style={styles.containerNoUSer}>
            <Text
              style={Fonts.style.semiBold(
                Colors.dark,
                Fonts.size.h6,
                'center',
              )}>
              {'Ups...'}
            </Text>
            <View style={{height: 10}} />
            <Text
              style={Fonts.style.regular(
                Colors.dark,
                Fonts.size.medium,
                'center',
              )}>
              {'No encontramos ordenes activas en nuestro sistema'}
            </Text>
          </View>
        )}

        {toggleType === 1 && history.length === 0 && (
          <View style={styles.containerNoUSer}>
            <Text
              style={Fonts.style.semiBold(
                Colors.dark,
                Fonts.size.h6,
                'center',
              )}>
              {'Ups...'}
            </Text>
            <View style={{height: 10}} />
            <Text
              style={Fonts.style.regular(
                Colors.dark,
                Fonts.size.medium,
                'center',
              )}>
              {'No encontramos ordenes pasadas en nuestro sistema'}
            </Text>
          </View>
        )}

        <View
          style={{
            width: Metrics.screenWidth * 0.9,
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignSelf: 'center',
            marginVertical: 20,
          }}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Home');
            }}
            style={[
              styles.btnGeneric,
              {
                backgroundColor: Colors.client.primaryColor,
                flex: 0,
                paddingHorizontal: 20,
              },
            ]}>
            <Text
              style={Fonts.style.semiBold(
                Colors.light,
                Fonts.size.medium,
                'center',
              )}>
              {'Crear nuevo servicio'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{height: Metrics.addFooter + 20}} />
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  contentContainer: {
    backgroundColor: Colors.light,
    marginHorizontal: 5,
    padding: 10,
    marginTop: 5,
    borderRadius: 10,
    flexDirection: 'row',
  },
});

export default Content;
