import React, {useContext, useState, useEffect, Fragment} from 'react';
import {View, ScrollView, StyleSheet, Text} from 'react-native';
import {Colors, Metrics, ApplicationStyles, Fonts} from '../../themes';
import ExpertDealOffer from '../../components/ExpertDealOffer';
import {StoreContext} from '../../flux';
import {updateProfile} from '../../flux/auth/actions';
import {
  getExpertOpenOrders,
  assingExpert,
  getDeviceInfo,
  getExpertActiveOrders,
  getExpertHistoryOrders,
} from '../../flux/util/actions';

import Geolocation from '@react-native-community/geolocation';
import NoOrders from './NoOrders';
import HeaderExpert from './HeaderExpert';
import ModalApp from '../../components/ModalApp';
import DetailModal from '../HistoryExpert/DetailModal';
import NextOrder from '../NextOrder';

const HomeExpert = () => {
  const {state, authDispatch, utilDispatch} = useContext(StoreContext);
  const {auth, util} = state;
  const {user, loading} = auth;
  const {expertActiveOrders, deviceInfo, nextOrder} = util;

  const [modalDetail, setModalDetail] = useState(false);
  const [detailOrder, setDetailOrder] = useState(null);

  console.log('appType =>', appType);
  useEffect(() => {
    getDeviceInfo(utilDispatch);
    if (user) {
      const {activity, isEnabled} = user;

      currentCoordinate();
      getExpertActiveOrders(utilDispatch);
      getExpertHistoryOrders(utilDispatch);

      if (isEnabled) {
        getExpertOpenOrders(activity, utilDispatch);
      }
    }
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
      updateProfile(coordinate, 'coordinate', authDispatch);
    }
  }, [coordinate]);

  console.log('loading home =>', loading);

  console.log('nextOrder=>', typeof nextOrder);
  const activeDetailModal = (order) => {
    setDetailOrder(order);
    setModalDetail(true);
  };
  return (
    <>
      <View style={styles.container}>
        <HeaderExpert user={user} dispatch={authDispatch} />
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

        {expertActiveOrders && expertActiveOrders.length > 0 ? (
          <ScrollView
            style={[ApplicationStyles.scrollHomeExpert, {flex: 1}]}
            bounces={true}>
            <Text
              style={[
                Fonts.style.bold(Colors.dark, Fonts.size.h6, 'left'),
                {marginVertical: 20, marginLeft: 20},
              ]}>
              {`Tienes una ordén ${expertActiveOrders.length} disponible`}
            </Text>
            {expertActiveOrders.map((item, index) => {
              return (
                <View key={index}>
                  <ExpertDealOffer
                    order={item}
                    user={user}
                    dispatch={utilDispatch}
                    assingExpert={assingExpert}
                  />
                </View>
              );
            })}
          </ScrollView>
        ) : (
          <NoOrders user={user} />
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
