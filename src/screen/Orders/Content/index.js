import React, {useContext, useState, Fragment, useEffect, useRef} from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import {Fonts, Colors, Metrics} from '../../../themes';
import {StoreContext} from '../../../flux';
import {ScrollView} from 'react-native-gesture-handler';
import ExpandOrderData from '../../ExpandOrderData';
import Header from '../../../components/Header';
import {useNavigation} from '@react-navigation/native';
import {getOrders} from '../../../flux/util/actions';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Content = () => {
  const {utilDispatch} = useContext(StoreContext);
  const isMountedRef = useRef(null);

  const navigation = useNavigation();
  const {state} = useContext(StoreContext);
  const {util} = state;
  const {orders, history} = util;
  const [menuIndex, setMenuIndex] = useState(0);

  useEffect(() => {
    isMountedRef.current = true;
    getOrders(utilDispatch);
    return () => {
      return () => (isMountedRef.current = false);
    };
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
            {menuIndex === 0 && orders.length > 0
              ? orders.map((item, index) => {
                  return (
                    <View style={{marginBottom: 5}} key={index}>
                      <ExpandOrderData
                        activeDetailModal={activeDetailModal}
                        order={item}
                        appType={'client'}
                      />
                    </View>
                  );
                })
              : menuIndex === 0 && (
                  <View>
                    <Icon
                      name="room-service-outline"
                      size={50}
                      color={Colors.client.primaryColor}
                      style={{alignSelf: 'center', marginTop: 40}}
                    />
                    <Text
                      style={[
                        Fonts.style.bold(Colors.dark, Fonts.size.h4, 'center'),
                        {marginTop: 10},
                      ]}>
                      Lo siento
                    </Text>
                    <Text
                      style={[
                        Fonts.style.regular(
                          Colors.dark,
                          Fonts.size.medium,
                          'center',
                        ),
                        {marginTop: 10},
                      ]}>
                      Actualmente no cuentas con ordenes activas
                    </Text>
                  </View>
                )}
            {menuIndex === 1 && history.length > 0
              ? history.map((item, index) => {
                  return (
                    <Fragment key={index}>
                      <ExpandOrderData
                        activeDetailModal={activeDetailModal}
                        order={item}
                        appType={'client'}
                      />
                    </Fragment>
                  );
                })
              : menuIndex === 1 && (
                  <View>
                    <Icon
                      name="history"
                      size={50}
                      color={Colors.client.primaryColor}
                      style={{alignSelf: 'center', marginTop: 40}}
                    />
                    <Text
                      style={[
                        Fonts.style.bold(Colors.dark, Fonts.size.h4, 'center'),
                        {marginTop: 10},
                      ]}>
                      Lo siento
                    </Text>
                    <Text
                      style={[
                        Fonts.style.regular(
                          Colors.dark,
                          Fonts.size.medium,
                          'center',
                        ),
                        {marginTop: 10},
                      ]}>
                      Actualmente no cuentas con ordenes en tu historial
                    </Text>
                  </View>
                )}
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
