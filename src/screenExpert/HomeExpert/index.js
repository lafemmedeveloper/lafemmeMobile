import React, {
  useContext,
  useState,
  useEffect,
  Fragment,
  useRef,
  useCallback,
} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  StatusBar,
  TouchableOpacity,
  Platform,
} from 'react-native';
import * as Sentry from '@sentry/react-native';
import {Colors, Metrics, ApplicationStyles, Fonts} from '../../themes';
import ExpertDealOffer from '../../components/ExpertDealOffer';
import {StoreContext} from '../../flux';
import {
  activeMessage,
  setUser,
  suscribeCoverage,
  updateProfile,
} from '../../flux/auth/actions';
import {
  getExpertOpenOrders,
  getDeviceInfo,
  getExpertActiveOrders,
  activeNameSlug,
  getConfig,
  setLoading,
} from '../../flux/util/actions';

import Geolocation from '@react-native-community/geolocation';
import NoOrders from './NoOrders';
import HeaderExpert from './HeaderExpert';
import ModalApp from '../../components/ModalApp';
import Loading from '../../components/Loading';
import DetailModal from '../HistoryExpert/DetailModal';
import NextOrder from '../NextOrder';
import auth from '@react-native-firebase/auth';

const HomeExpert = () => {
  const {state, authDispatch, utilDispatch} = useContext(StoreContext);
  const {util} = state;
  const {expertActiveOrders, nextOrder} = util;
  const isMountedRef = useRef(null);

  const [modalDetail, setModalDetail] = useState(false);
  const [detailOrder, setDetailOrder] = useState(null);
  const [updateUser, setUpdateUser] = useState(false);

  const onAuthStateChanged = useCallback(
    (date) => {
      if (auth().currentUser && auth().currentUser.uid) {
        console.log('onAuthStateChanged:user', date._user);

        setUser(auth().currentUser.uid, authDispatch);
      }
    },
    [authDispatch],
  );

  const activeFlux = useCallback(async () => {
    isMountedRef.current = true;

    getDeviceInfo(utilDispatch);

    if (state.auth.user) {
      if (!updateUser) {
        setLoading(true, utilDispatch);
        activeMessage('expert');
        await currentCoordinate();
        await getConfig(utilDispatch);
        await suscribeCoverage(state.auth.user.coverage);
        await activeNameSlug(state.auth.user.activity, utilDispatch);
        getExpertActiveOrders(state.auth.user, utilDispatch);
        getExpertOpenOrders(state.auth.user.activity, utilDispatch);
        setLoading(false, utilDispatch);
        setUpdateUser(true);
      }

      Sentry.setUser({
        email: state.auth.user.email,
        userID: state.auth.user.uid,
        name: `${state.auth.user.firstName} ${state.auth.user.lastName}`,
        phone: state.auth.user.phone,
        extra: {
          role: state.auth.user.role,
          rating: state.auth.user.rating,
        },
      });
    }
  }, [currentCoordinate, state.auth.user, updateUser, utilDispatch]);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, [onAuthStateChanged]);

  useEffect(() => {
    activeFlux();
    return () => {
      return () => (isMountedRef.current = false);
    };
  }, [activeFlux, utilDispatch]); // TODO: revisar loop zonas de cobertura

  const currentCoordinate = useCallback(async () => {
    const config = {
      skipPermissionRequests: Platform.OS === 'ios' ? true : false,
      authorizationLevel: 'whenInUse',
    };
    //Geolocation.requestAuthorization();

    Geolocation.setRNConfiguration(config);
    await Geolocation.getCurrentPosition(async (info) => {
      await updateProfile(
        {
          latitude: info.coords.latitude,
          longitude: info.coords.longitude,
        },
        'coordinates',
        authDispatch,
      );
    });
  }, [authDispatch]);

  const activeDetailModal = (order) => {
    setDetailOrder(order);
    setModalDetail(true);
  };

  return (
    <>
      <StatusBar backgroundColor={'white'} barStyle={'dark-content'} />

      <View style={styles.container}>
        <HeaderExpert user={state.auth.user} dispatch={authDispatch} />
        {__DEV__ && (
          <TouchableOpacity
            onPress={() => {
              throw new Error('My first Sentry error!');
            }}>
            <Text>SentryTest</Text>
          </TouchableOpacity>
        )}
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
                {marginVertical: 20, marginLeft: 10},
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

      <Loading />
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
