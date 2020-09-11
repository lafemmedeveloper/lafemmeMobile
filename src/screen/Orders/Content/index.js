import React, {useContext, useState, Fragment} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {Metrics} from '../../../themes';
import {StoreContext} from '../../../flux';
import {ScrollView} from 'react-native-gesture-handler';
import ExpandOrderData from '../../ExpandOrderData';
import Header from './Header';
import ModalApp from '../../../components/ModalApp';
import {useNavigation} from '@react-navigation/native';

const Content = () => {
  const navigation = useNavigation();
  const {state /*  serviceDispatch, authDispatch */} = useContext(StoreContext);

  const {auth, util} = state;

  const {user} = auth;
  const {orders, history} = util;

  const [menuIndex, setMenuIndex] = useState(0);
  const [modalDetail, setModalDetail] = useState(false);

  const activeDetailModal = (order) => {
    navigation.navigate('OrderDetail', order);
  };

  return (
    <>
      <View style={styles.container}>
        <Header
          title={'Mi Agenda'}
          menuIndex={menuIndex}
          user={user}
          ordersActive={orders.length}
          onAction={(pos) => setMenuIndex(pos)}
          onActionR={() => {}}
        />

        <ScrollView
          style={{
            flex: 1,
            width: Metrics.screenWidth,
            height: '100%',
            marginTop: 40 + Metrics.addHeader,
            paddingTop: 40,
          }}>
          <>
            {menuIndex === 0 &&
              orders.length > 0 &&
              orders.map((item, index) => {
                return (
                  <View style={{marginBottom: 10}} key={index}>
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
                    <ExpandOrderData order={item} appType={'client'} />
                  </Fragment>
                );
              })}
          </>
        </ScrollView>
      </View>
      <ModalApp open={modalDetail} setOpen={setModalDetail}>
        <Text>Hello</Text>
      </ModalApp>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Content;
