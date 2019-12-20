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
// import GalleryScreen from '../Screens/Gallery';
// import ServicesScreen from '../Screens/Services';,
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
// const GalleryStack = createStackNavigator(
//   {
//     Gallery: {
//       screen: GalleryScreen,
//     },
//   },
//   {
//     headerMode: 'none',
//     initialRouteName: 'Gallery',
//     navigationOptions: {
//       gesturesEnabled: false,
//     },
//   },
// );

const ServicesStack = createStackNavigator(
  {
    Services: {
      screen: HomeScreen,
    },
  },
  {
    headerMode: 'none',
    initialRouteName: 'Services',
    navigationOptions: {
      gesturesEnabled: false,
    },
  },
);

// const ProfileStack = createStackNavigator(
//   {
//     Services: {
//       screen: ProfileScreen,
//     },
//   },
//   {
//     headerMode: 'none',
//     initialRouteName: 'Services',
//     navigationOptions: {
//       gesturesEnabled: false,
//     },
//   },
// );
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

    Services: {
      screen: HomeStack,
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
      screen: HomeStack,
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
    order: ['Home', 'Services', 'Profile'],
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
    resizeMode: 'contain',
  },
};

const AppContainer = createAppContainer(AppNavigator);

export default AppContainer;
