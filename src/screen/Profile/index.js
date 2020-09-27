import React, {useContext} from 'react';

import {StoreContext} from '../../flux';
import ButtonLogin from '../../components/ButtonLogin';
import Content from './Content';

const Profile = () => {
  const {state, authDispatch} = useContext(StoreContext);
  const {auth, util} = state;
  const {user} = auth;
  const {deviceInfo} = util;
  console.log('==> deviceInfo', deviceInfo);

  if (!user) {
    return <ButtonLogin />;
  } else {
    return <Content state={state} dispatch={authDispatch} />;
  }
};

export default Profile;
