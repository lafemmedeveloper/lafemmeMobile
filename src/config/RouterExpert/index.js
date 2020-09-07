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

  if (user) {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          {user.imageUrl ? (
            <Stack.Screen
              name={'TabBottom'}
              component={TabBottom}
              options={{
                headerShown: false,
              }}
            />
          ) : (
            <Stack.Screen
              name={'NoImage'}
              component={NoImage}
              options={{
                headerShown: false,
              }}
            />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    );
  } else {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Login expert"
            component={LoginExpert}
            options={{
              headerShown: false,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
};

export default Router;
