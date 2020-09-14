import React, {useEffect, useContext, useState, Fragment} from 'react';
import {View, StyleSheet} from 'react-native';
import {StoreContext} from '../../flux';
import {getExpertActiveOrders} from '../../flux/util/actions';
import Header from './Header';
import {ScrollView} from 'react-native-gesture-handler';
import {Metrics} from '../../themes';
import ExpandHistoryData from './ExpandHistoryData';
import ModalApp from '../../components/ModalApp';
import DetailModal from './DetailModal';

const HistoryExpert = () => {
  const {state, utilDispatch} = useContext(StoreContext);
  const {util, auth} = state;
  const {user} = auth;
  const {expertOpenOrders, expertHistoryOrders} = util;
  console.log('expertActiveOrders ==>', expertOpenOrders);

  const [menuIndex, setMenuIndex] = useState(0);
  const [modalDetail, setModalDetail] = useState(false);
  const [detailOrder, setDetailOrder] = useState(null);
  const activeDetailModal = (order) => {
    setDetailOrder(order);
    setModalDetail(true);
  };
  useEffect(() => {
    getExpertActiveOrders(utilDispatch);
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
            fielx: 1,
            width: Metrics.screenWidth,
            height: '100%',
            marginTop: 40 + Metrics.addHeader,
            paddingTop: 25,
          }}>
          <>
            {menuIndex === 0 &&
              expertOpenOrders.length > 0 &&
              expertOpenOrders.map((item, index) => {
                return (
                  <Fragment key={index}>
                    <ExpandHistoryData
                      activeDetailModal={activeDetailModal}
                      order={item}
                      appType={'expert'}
                    />
                  </Fragment>
                );
              })}
            {menuIndex === 1 &&
              expertHistoryOrders.length > 0 &&
              expertHistoryOrders.map((item, index) => {
                return (
                  <Fragment key={index}>
                    <ExpandHistoryData
                      activeDetailModal={activeDetailModal}
                      order={item}
                      appType={'expert'}
                    />
                  </Fragment>
                );
              })}
          </>
        </ScrollView>
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
    flexDirection: 'column',
  },
});

export default HistoryExpert;
