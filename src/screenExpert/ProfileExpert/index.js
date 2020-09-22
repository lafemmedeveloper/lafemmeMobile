import React, {useContext} from 'react';
import {Text} from 'react-native';
import {StoreContext} from '../../flux';
import Content from './Content';

const ProfileExpert = () => {
  const {state, authDispatch} = useContext(StoreContext);
  const {auth, util} = state;
  const {user} = auth;
  const {deviceInfo} = util;
  if (!user) {
    return <Text> no ahi foto</Text>;
  } else {
    return (
      <Content
        state={auth}
        util={util}
        dispatch={authDispatch}
        deviceInfo={deviceInfo}
      />
    );
  }
};

export default ProfileExpert;
