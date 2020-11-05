import React, {useEffect, useContext, useState, Fragment, useRef} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {StoreContext} from '../../flux';
import {getExpertActiveOrders, getOrders} from '../../flux/util/actions';
import Header from './Header';
import {ScrollView} from 'react-native-gesture-handler';
import {Colors, Fonts, Metrics} from '../../themes';
import ExpandHistoryData from './ExpandHistoryData';
import ModalApp from '../../components/ModalApp';
import DetailModal from './DetailModal';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const HistoryExpert = () => {
  const {state, utilDispatch} = useContext(StoreContext);
  const {util, auth} = state;
  const {user} = auth;
  const {expertOpenOrders, expertHistoryOrders} = util;

  const isMountedRef = useRef(null);

  const [menuIndex, setMenuIndex] = useState(0);
  const [detailOrder, setDetailOrder] = useState(null);

  const activeDetailModal = (order) => {
    setDetailOrder(order);
  };

  useEffect(() => {
    isMountedRef.current = true;

    getOrders(utilDispatch);
    getExpertActiveOrders(state.auth.user, utilDispatch);
    return () => {
      return () => (isMountedRef.current = false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <View style={styles.container}>
        <Header
          title={'Mi Agenda'}
          menuIndex={menuIndex}
          user={user}
          ordersActive={expertOpenOrders.length}
          onAction={(pos) => setMenuIndex(pos)}
          onActionR={() => {}}
        />

        <ScrollView
          style={{
            flex: 1,
          }}>
          <>
            {menuIndex === 0 && expertOpenOrders.length > 0
              ? expertOpenOrders.map((item, index) => {
                  return (
                    <Fragment key={index}>
                      <ExpandHistoryData
                        activeDetailModal={activeDetailModal}
                        order={item}
                        appType={'expert'}
                      />
                    </Fragment>
                  );
                })
              : menuIndex === 0 && (
                  <View>
                    <Icon
                      name="room-service-outline"
                      size={50}
                      color={Colors.expert.primaryColor}
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
            {menuIndex === 1 && expertHistoryOrders.length > 0
              ? expertHistoryOrders.map((item, index) => {
                  return (
                    <Fragment key={index}>
                      <ExpandHistoryData
                        activeDetailModal={activeDetailModal}
                        order={item}
                        appType={'expert'}
                      />
                    </Fragment>
                  );
                })
              : menuIndex === 1 && (
                  <View>
                    <Icon
                      name="history"
                      size={50}
                      color={Colors.expert.primaryColor}
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
                      Actualmente no cuentas con ordenes anteriores
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
    width: Metrics.screenWidth,
    height: Metrics.screenHeight,
    flexDirection: 'column',
  },
});

export default HistoryExpert;
