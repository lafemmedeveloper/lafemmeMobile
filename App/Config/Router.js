import React from 'react';
import {Image} from 'react-native';

import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {createBottomTabNavigator} from 'react-navigation-tabs';

import LoadingScreen from '../Screens/Loading/';
import HomeScreen from '../Screens/Home';
// import HomeScreenExpert from '../ScreensExpert/Home';
import LoginScreen from '../Screens/Login';
import ProductDetailScreen from '../Screens/ProductDetail';
import RegisterScreen from '../Screens/Register';

import ProfileScreen from '../Screens/Profile';
// import GalleryScreen from '../Screens/Gallery';
import OrdersScreen from '../Screens/Orders';
// import ProfileScreen from '../Screens/Profile';

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

const OrdersStack = createStackNavigator(
  {
    Orders: {
      screen: OrdersScreen,
    },
  },
  {
    headerMode: 'none',
    initialRouteName: 'Orders',
    navigationOptions: {
      gesturesEnabled: false,
    },
  },
);

const ProfileStack = createStackNavigator(
  {
    Profile: {
      screen: ProfileScreen,
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
    // Gallery: {
    //   screen: GalleryStack,
    //   navigationOptions: ({navigation}) => {
    //     const tabBarVisible = navigation.state.index === 0;
    //     return {
    //       tabBarVisible,
    //       tabBarLabel: 'Cupones',
    //       tabBarIcon: ({tintColor}) => (
    //         <Image
    //           style={[styles.icon, {tintColor}]}
    //           source={Images.menuGift}
    //         />
    //       ),
    //     };
    //   },
    // },

    Orders: {
      screen: OrdersStack,
      navigationOptions: ({navigation}) => {
        const tabBarVisible = navigation.state.index === 0;
        return {
          tabBarVisible,
          tabBarLabel: 'Mis Servicios',
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
    order: ['Home', 'Orders', 'Profile'],
    tabBarOptions: {
      activeTintColor: Colors.client.primaryColor,
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
    ProductDetail: {
      screen: ProductDetailScreen,
    },
    Register: {
      screen: RegisterScreen,
    },

    Tabs: {
      screen: TabNavigator,
    },
  },
  {
    headerMode: 'none',
    initialRouteName: 'Tabs',
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
    marginBottom: 2.5,

    resizeMode: 'contain',
  },
};

const AppContainer = createAppContainer(AppNavigator);

export default AppContainer;
