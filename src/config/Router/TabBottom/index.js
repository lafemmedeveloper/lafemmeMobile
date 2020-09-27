import React, {useContext} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from '../../../screen/Home';
import Orders from '../../../screen/Orders';
import Profile from '../../../screen/Profile';
import {Colors, Images} from '../../../themes';
import {Image} from 'react-native';
import Loading from '../../../components/Loading';
import {StoreContext} from '../../../flux';

const Tab = createBottomTabNavigator();

export default function TabBottom() {
  const {state} = useContext(StoreContext);
  const {auth, util} = state;

  return (
    <>
      <Loading //TODO: Por que esto esta detrás del componente? debería estar al frente para que se pueda renderizar
        type={'client'}
        loading={auth.loading || util.loading}
      />
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
    </>
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
