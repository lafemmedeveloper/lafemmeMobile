import React, {useContext} from 'react';
import {Text} from 'react-native';
import {StoreContext} from '../../flux';
import Content from './Content';

const ProfileExpert = () => {
  const {state} = useContext(StoreContext);
  const {auth} = state;
  const {user} = auth;
  if (!user) {
    return <Text> no ahi foto</Text>;
  } else {
    return <Content />;
  }
};

export default ProfileExpert;
