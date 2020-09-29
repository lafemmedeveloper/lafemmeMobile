import React, {useContext, useState, Fragment, useEffect} from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import {Fonts, Colors, Metrics} from '../../../themes';
import {StoreContext} from '../../../flux';
import {ScrollView} from 'react-native-gesture-handler';
import ExpandOrderData from '../../ExpandOrderData';
// import Header from './Header';
import Header from '../../../components/Header';
import {useNavigation} from '@react-navigation/native';
import {getOrders} from '../../../flux/util/actions';

const Content = () => {
  const {utilDispatch} = useContext(StoreContext);

  const navigation = useNavigation();
  const {state /*  serviceDispatch, authDispatch */} = useContext(StoreContext);
  const {util} = state;
  const {orders, history} = util;
  const [menuIndex, setMenuIndex] = useState(0);

  useEffect(() => {
    getOrders(utilDispatch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const activeDetailModal = (order) => {
    navigation.navigate('OrderDetail', order);
  };

  return (
    <>
      <View style={styles.container}>
        <Header
          appType={'client'}
          title={'Mis Servicios'}
          user={null}
          selectAddress={() => {}}>
          <View style={[styles.childrenHeader]}>
            <TouchableOpacity
              onPress={() => {
                setMenuIndex(0);
              }}
              style={styles.itemBtn}>
              <Text
                style={Fonts.style.bold(
                  Colors.dark,
                  Fonts.size.medium,
                  'center',
                )}>
                {'Activas'}
              </Text>
              <View
                style={[
                  styles.itemMenu,
                  {
                    height: menuIndex === 0 ? 3 : 0,
                  },
                ]}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setMenuIndex(1);
              }}
              style={styles.itemBtn}>
              <Text
                style={Fonts.style.bold(
                  Colors.dark,
                  Fonts.size.medium,
                  'center',
                )}>
                {'Historial'}
              </Text>
              <View
                style={[
                  styles.itemMenu,
                  {
                    height: menuIndex === 1 ? 3 : 0,
                  },
                ]}
              />
            </TouchableOpacity>
          </View>
        </Header>

        <ScrollView
          style={{
            flex: 1,
            width: Metrics.screenWidth,
            height: '100%',
          }}>
          <>
            {menuIndex === 0 &&
              orders.length > 0 &&
              orders.map((item, index) => {
                return (
                  <View style={{marginBottom: 5}} key={index}>
                    <ExpandOrderData
                      activeDetailModal={activeDetailModal}
                      order={item}
                      appType={'client'}
                    />
                  </View>
                );
              })}
            {menuIndex === 1 &&
              history.length > 0 &&
              history.map((item, index) => {
                return (
                  <Fragment key={index}>
                    <ExpandOrderData
                      activeDetailModal={activeDetailModal}
                      order={item}
                      appType={'client'}
                    />
                  </Fragment>
                );
              })}
          </>
        </ScrollView>
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  childrenHeader: {
    flexDirection: 'row',
  },
  itemMenu: {
    width: '100%',
    backgroundColor: Colors.client.primaryColor,
    position: 'absolute',
    bottom: 0,
  },

  itemBtn: {flex: 1, paddingVertical: 10},
});

export default Content;
