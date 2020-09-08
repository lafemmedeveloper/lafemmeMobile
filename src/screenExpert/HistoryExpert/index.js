import React, {useEffect, useContext} from 'react';
import {Text} from 'react-native';
import {StoreContext} from '../../flux';
import {getExpertActiveOrders} from '../../flux/util/actions';
import Header from './Header';

const HistoryExpert = () => {
  const {state, utilDispatch} = useContext(StoreContext);
  const {util} = state;
  const {expertOpenOrders} = util;
  console.log('expertActiveOrders ==>', expertOpenOrders);

  useEffect(() => {
    getExpertActiveOrders(utilDispatch);
  }, []);
  return (
    <>
      <Header />
      <Text>dsede HistoryExpert expert</Text>
    </>
  );
};

export default HistoryExpert;
