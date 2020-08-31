import React, {useContext} from 'react';

import {StoreContext} from '../../flux';
import ButtonLogin from '../../components/ButtonLogin';
import Content from './Content';

const Profile = () => {
  const {state, authDispatch} = useContext(StoreContext);
  const {auth} = state;
  const {user} = auth;
  console.log('usuario current=>', user);

  if (!user) {
    return <ButtonLogin />;
  } else {
    return <Content state={auth} dispatch={authDispatch} />;
  }
};

export default Profile;
