import React, {useContext} from 'react';
import {Text} from 'react-native';
import {StoreContext} from '../../flux';
import Content from './Content';

const ProfileExpert = () => {
  const {state, authDispatch} = useContext(StoreContext);
  const {auth} = state;
  const {user} = auth;
  console.log('form user =>', user);
  if (!user) {
    return <Text> no ahi foto</Text>;
  } else {
    return <Content state={auth} dispatch={authDispatch} />;
  }
};

export default ProfileExpert;
