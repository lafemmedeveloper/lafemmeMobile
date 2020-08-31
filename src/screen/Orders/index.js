import React, {useContext} from 'react';
import {Text} from 'react-native';

import {StoreContext} from '../../flux';
import ButtonLogin from '../../components/ButtonLogin';

const Orders = () => {
  const {state} = useContext(StoreContext);
  const {auth} = state;
  const {user} = auth;
  if (!user) {
    return <ButtonLogin />;
  } else {
    return <Text>si ahi</Text>;
  }
};

export default Orders;
