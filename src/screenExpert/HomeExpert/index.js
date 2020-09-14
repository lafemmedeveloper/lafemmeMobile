import React, {useContext, useState, useEffect} from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import {Colors, Metrics, ApplicationStyles} from '../../themes';
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

const HomeExpert = () => {
  const {state, authDispatch, utilDispatch} = useContext(StoreContext);
  const {auth, util} = state;
  const {user, loading} = auth;
  const {expertActiveOrders, deviceInfo} = util;

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

  console.log('coordinate home =>', coordinate);
  return (
    <>
      <View style={styles.container}>
        <HeaderExpert user={user} dispatch={authDispatch} />

        {expertActiveOrders && expertActiveOrders.length > 0 ? (
          <ScrollView
            style={[ApplicationStyles.scrollHomeExpert, {flex: 1}]}
            bounces={true}>
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
