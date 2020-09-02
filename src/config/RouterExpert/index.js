import React, {useContext, useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import TabBottom from './TabBottom';

import {observeUser} from '../../flux/auth/actions';
import {StoreContext} from '../../flux';
import LoginExpert from '../../screenExpert/LoginExpert';
import NoImage from '../../screenExpert/NoImage';

const Stack = createStackNavigator();

const Router = () => {
  const {authDispatch, state} = useContext(StoreContext);
  const {auth} = state;
  const {user} = auth;
  useEffect(() => {
    observeUser(authDispatch);
  }, []);

  console.log('user expert =>', user);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user != null ? (
          <Stack.Screen
            name={user.imageUrl ? 'TabBottom' : 'NoImage'}
            component={user.imageUrl ? TabBottom : NoImage}
            options={{
              headerShown: false,
            }}
          />
        ) : (
          <Stack.Screen
            name="Login expert"
            component={LoginExpert}
            options={{
              headerShown: false,
            }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Router;
