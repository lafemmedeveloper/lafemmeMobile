import React, {useContext, useState, useEffect, Fragment} from 'react';
import {View, ScrollView, StyleSheet, Text, StatusBar} from 'react-native';
import {Colors, Metrics, ApplicationStyles, Fonts} from '../../themes';
import ExpertDealOffer from '../../components/ExpertDealOffer';
import {StoreContext} from '../../flux';
import {activeMessage, setUser, updateProfile} from '../../flux/auth/actions';
import {
  getExpertOpenOrders,
  assingExpert,
  getDeviceInfo,
  getExpertActiveOrders,
  getExpertHistoryOrders,
  activeNameSlug,
} from '../../flux/util/actions';

import Geolocation from '@react-native-community/geolocation';
import NoOrders from './NoOrders';
import HeaderExpert from './HeaderExpert';
import ModalApp from '../../components/ModalApp';
import DetailModal from '../HistoryExpert/DetailModal';
import NextOrder from '../NextOrder';
import messaging from '@react-native-firebase/messaging';
import auth from '@react-native-firebase/auth';

const HomeExpert = () => {
  const {state, authDispatch, utilDispatch} = useContext(StoreContext);
  const {util} = state;
  const {expertActiveOrders, deviceInfo, nextOrder} = util;

  const [modalDetail, setModalDetail] = useState(false);
  const [detailOrder, setDetailOrder] = useState(null);

  console.log('appType =>', appType);

  function onAuthStateChanged(user) {
    if (auth().currentUser && auth().currentUser.uid) {
      console.log('onAuthStateChanged:user', user._user);

      setUser(auth().currentUser.uid, authDispatch);
    }
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getDeviceInfo(utilDispatch);
    if (state.auth.user) {
      currentCoordinate();
      activeMessage('expert', utilDispatch);
      getExpertActiveOrders(utilDispatch);
      getExpertHistoryOrders(utilDispatch);
      activeNameSlug(state.auth.user.activity, utilDispatch);
      getExpertOpenOrders(state.auth.user.activity, utilDispatch);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const appType = deviceInfo;

  const [coordinate, setCoordinate] = useState(null);

  const currentCoordinate = () => {
    Geolocation.getCurrentPosition((info) =>
      setCoordinate({
        latitude: info.coords.latitude,
        longitude: info.coords.longitude,
      }),
    );
  };

  useEffect(() => {
    if (coordinate) {
      return () => updateProfile(coordinate, 'coordinate', authDispatch);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coordinate]);

  const activeDetailModal = (order) => {
    setDetailOrder(order);
    setModalDetail(true);
  };

  return (
    <>
      <StatusBar backgroundColor={Colors.expert.primaryColor} />
      <View style={styles.container}>
        <HeaderExpert user={state.auth.user} dispatch={authDispatch} />
        {nextOrder &&
          nextOrder.length > 0 &&
          nextOrder.map((item, index) => {
            return (
              <Fragment key={index}>
                <NextOrder
                  activeDetailModal={activeDetailModal}
                  order={item}
                  appType={'expert'}
                />
              </Fragment>
            );
          })}
        {state.auth.user &&
        state.auth.user.isEnabled &&
        expertActiveOrders &&
        expertActiveOrders.length > 0 ? (
          <ScrollView
            style={[ApplicationStyles.scrollHomeExpert, {flex: 1}]}
            bounces={true}>
            <Text
              style={[
                Fonts.style.bold(Colors.dark, Fonts.size.h6, 'left'),
                {marginVertical: 20, marginLeft: 20},
              ]}>
              {`Tienes ${expertActiveOrders.length} ordén disponible`}
            </Text>
            {expertActiveOrders.map((item, index) => {
              return (
                <View key={index}>
                  <ExpertDealOffer
                    order={item}
                    user={state.auth.user}
                    dispatch={utilDispatch}
                    assingExpert={assingExpert}
                  />
                </View>
              );
            })}
          </ScrollView>
        ) : (
          <NoOrders user={state.auth.user} />
        )}
      </View>
      <ModalApp open={modalDetail} setOpen={setModalDetail}>
        <DetailModal order={detailOrder} setModalDetail={setModalDetail} />
      </ModalApp>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: Metrics.screenWidth,
    height: Metrics.screenHeight,
    backgroundColor: Colors.backgroundColor,
  },
});

export default HomeExpert;
