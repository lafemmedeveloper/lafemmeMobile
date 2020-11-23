import React, {useContext} from 'react';

import {StoreContext} from '../../flux';
import ButtonLogin from '../../components/ButtonLogin';
import Content from './Content';

const Orders = () => {
  const {state} = useContext(StoreContext);
  const {auth} = state;
  const {user} = auth;

  return <>{user ? <Content /> : <ButtonLogin />}</>;
};

export default Orders;
