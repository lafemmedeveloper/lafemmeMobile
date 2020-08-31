import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Colors, Images} from '../../../themes';
import {Image} from 'react-native';
import HomeExpert from '../../../screenExpert/HomeExpert';
import HistoryExpert from '../../../screenExpert/HistoryExpert';
import ProfileExpert from '../../../screenExpert/ProfileExpert';

const Tab = createBottomTabNavigator();

export default function TabBottom() {
  return (
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: Colors.expert.primaryColor,
      }}>
      <Tab.Screen
        name="Home"
        component={HomeExpert}
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
        component={HistoryExpert}
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
        component={ProfileExpert}
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
