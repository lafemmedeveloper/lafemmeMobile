import React from 'react';
import {Image} from 'react-native';

import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {createBottomTabNavigator} from 'react-navigation-tabs';

import LoadingScreen from '../ScreensExpert/Loading';
import HomeScreen from '../ScreensExpert/Home';
import LoginScreen from '../Screens/Login';
// import ProductDetailScreen from '../Screens/ProductDetail';
// import RegisterScreen from '../Screens/Register';
// import GalleryScreen from '../Screens/Gallery';
// import ServicesScreen from '../Screens/Services';
// import ProfileScreen from '../Screens/Profile';
// import DebugCViewScreen from '../../DebugView';

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
  },
  {
    order: ['Home'],
    tabBarOptions: {
      activeTintColor: Colors.expert.primartColor,
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
