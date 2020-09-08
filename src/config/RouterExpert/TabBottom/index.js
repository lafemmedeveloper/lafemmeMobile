import React, {useContext} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Colors, Images} from '../../../themes';
import {Image} from 'react-native';
import HomeExpert from '../../../screenExpert/HomeExpert';
import HistoryExpert from '../../../screenExpert/HistoryExpert';
import ProfileExpert from '../../../screenExpert/ProfileExpert';
import Loading from '../../../components/Loading';
import {StoreContext} from '../../../flux';
import Icon from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

export default function TabBottom() {
  const {state} = useContext(StoreContext);
  const {auth, util} = state;
  const {loading} = auth;
  const {expertActiveOrders} = util;
  console.log('orders ==>', expertActiveOrders);

  return (
    <>
      <Loading type={'expert'} loading={loading} />
      <Tab.Navigator
        tabBarOptions={{
          activeTintColor: Colors.expert.primaryColor,
        }}>
        {expertActiveOrders.length > 0 ? (
          <Tab.Screen
            name="Home"
            component={HomeExpert}
            options={{
              tabBarLabel: 'Ordenes',
              tabBarIcon: ({color}) => (
                <Icon name={'time-outline'} size={25} color={color} />
              ),
              tabBarBadge: expertActiveOrders.length,
            }}
          />
        ) : (
          <Tab.Screen
            name="Home"
            component={HomeExpert}
            options={{
              tabBarLabel: 'Ordenes',
              tabBarIcon: ({color}) => (
                <Icon name={'time-outline'} size={25} color={color} />
              ),
            }}
          />
        )}

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
