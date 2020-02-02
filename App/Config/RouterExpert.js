import React from 'react';
import {Image} from 'react-native';

import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {createBottomTabNavigator} from 'react-navigation-tabs';

import LoadingScreen from '../ScreensExpert/Loading';
import HomeScreen from '../ScreensExpert/Home';
import LoginScreen from '../Screens/Login';
import ClientOnExpert from '../ScreensExpert/ClientOnExpert';

import History from '../ScreensExpert/History';
import Profile from '../ScreensExpert/Profile';

import {Colors, Images} from '../Themes';

const HomeStack = createStackNavigator(
  {
    Home: {
      screen: HomeScreen,
    },
  },
  {
    headerMode: 'none',
    initialRouteName: 'Home',
    navigationOptions: {
      gesturesEnabled: false,
    },
  },
);

const HistoryStack = createStackNavigator(
  {
    History: {
      screen: History,
    },
  },
  {
    headerMode: 'none',
    initialRouteName: 'History',
    navigationOptions: {
      gesturesEnabled: false,
    },
  },
);

const ProfileStack = createStackNavigator(
  {
    Profile: {
      screen: Profile,
    },
  },
  {
    headerMode: 'none',
    initialRouteName: 'Profile',
    navigationOptions: {
      gesturesEnabled: false,
    },
  },
);

const TabNavigator = createBottomTabNavigator(
  {
    Home: {
      screen: HomeStack,
      navigationOptions: ({navigation}) => {
        const tabBarVisible = navigation.state.index === 0;
        return {
          tabBarVisible,
          tabBarLabel: 'Inicio',
          tabBarIcon: ({tintColor}) => (
            <Image style={[styles.icon, {tintColor}]} source={Images.pin} />
          ),
        };
      },
    },
    History: {
      screen: HistoryStack,
      navigationOptions: ({navigation}) => {
        const tabBarVisible = navigation.state.index === 0;
        return {
          tabBarVisible,
          tabBarLabel: 'Mi Agenda',
          tabBarIcon: ({tintColor}) => (
            <Image
              style={[styles.icon, {tintColor}]}
              source={Images.menuAppoiment}
            />
          ),
        };
      },
    },
    Profile: {
      screen: ProfileStack,
      navigationOptions: ({navigation}) => {
        const tabBarVisible = navigation.state.index === 0;
        return {
          tabBarVisible,
          tabBarLabel: 'Perfil',
          tabBarIcon: ({tintColor}) => (
            <Image
              style={[styles.icon, {tintColor}]}
              source={Images.menuUser}
            />
          ),
        };
      },
    },
  },
  {
    order: ['Home', 'History', 'Profile'],
    tabBarOptions: {
      activeTintColor: Colors.expert.primaryColor,
      style: {
        backgroundColor: Colors.light,
        paddingTop: 10,
      },
    },
  },
);

const AppNavigator = createStackNavigator(
  {
    Loading: {
      screen: LoadingScreen,
    },
    Login: {
      screen: LoginScreen,
    },
    Home: {
      screen: TabNavigator,
    },
    ClientOnExpert: {
      screen: ClientOnExpert,
    },
  },
  {
    headerMode: 'none',
    initialRouteName: 'Loading',
    navigationOptions: {
      gesturesEnabled: false,
    },

    tabBarVisible: false,
  },
);

const styles = {
  icon: {
    flex: 0,
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },
};

const AppContainer = createAppContainer(AppNavigator);

export default AppContainer;
