import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from 'App/screen/Home';
import Orders from 'App/screen/Orders';
import Profile from 'App/screen/Profile';
import {Colors, Images} from 'App./../../themes';
import {Image} from 'react-native';

const Tab = createBottomTabNavigator();

export default function TabBottom() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBarOptions={{
        activeTintColor: Colors.client.primaryColor,
      }}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: 'Inicio',
          tabBarIcon: ({color}) => (
            <Image
              style={[styles.icon, {tintColor: color}]}
              source={Images.pin}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Ordenes"
        component={Orders}
        options={{
          tabBarLabel: 'Mis Servicios',
          tabBarIcon: ({color}) => (
            <Image
              style={[styles.icon, {tintColor: color}]}
              source={Images.menuAppoiment}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: 'Perfil',
          tabBarIcon: ({color}) => (
            <Image
              style={[styles.icon, {tintColor: color}]}
              source={Images.menuUser}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
const styles = {
  icon: {
    flex: 0,
    width: 25,
    height: 25,
    marginBottom: 2.5,
    resizeMode: 'contain',
  },
};
