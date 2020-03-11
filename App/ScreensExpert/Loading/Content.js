/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Keyboard,
  ScrollView,
} from 'react-native';

import _ from 'lodash';
import {
  Colors,
  Fonts,
  Images,
  Metrics,
  ApplicationStyles,
  FlatList,
} from '../../Themes';
import auth from '@react-native-firebase/auth';
import styles from './styles';

import messaging from '@react-native-firebase/messaging';
import Utilities from '../../Utilities';

export default class Loading extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    const {
      navigation,
      getDeviceInfo,
      setAuth,
      setAccount,
      setLoading,
      user,
    } = this.props;

    // console.log('props', this.props);

    setLoading(true);
    await getDeviceInfo();

    if (!auth().currentUser) {
      navigation.navigate('Login');
    }

    this.unsubscriber = auth().onAuthStateChanged(async authUser => {
      // console.log('user:unsuscriber', authUser);
      // console.log('user:auth().currentUser', auth().currentUser.uid);

      if (auth().currentUser && auth().currentUser.uid) {
        // console.log('user:loading', authUser);
        await setAuth(authUser);

        if (auth().currentUser && auth().currentUser.uid && user == null) {
          // console.log('=> auth().currentUser.uid', auth().currentUser.uid);
          await setAccount(auth().currentUser.uid);

          navigation.navigate('Home');
        }
      } else {
        navigation.navigate('Login');
      }
    });

    if (auth().currentUser && auth().currentUser.uid) {
      // console.log(auth().currentUser);
      await setAccount(auth().currentUser.uid);
    }

    // Notifications Module
    console.log('startMessaging');
    messaging()
      .hasPermission()
      .then(enabled => {
        console.log('push permissions');
        if (enabled) {
          console.log('hasPermission', enabled);

          messaging()
            .getToken()
            .then(token => {
              if (token) {
                console.log('token', token);
                Utilities.log('token', token, 'green');
                messaging().subscribeToTopic('expert');
              } else {
                console.log('token failed');
              }
            });
          // user has permissions
        } else {
          // user doesn't have permission
          console.log('user does not have permission');

          messaging()
            .requestPermission()
            .then(() => {
              // User has authorised
              console.log('User has authorised');
            })
            .catch(error => {
              // User has rejected permissions
              console.log('User has rejected permissions', error);
            });
        }
      });

    this.messageListener = messaging().onMessage(message => {
      // Process your message as required
      console.log('Process your message as required: message', message);
      // Alert.alert(message.data.title, message.data.body);
    });
    //END Notifications Module

    setLoading(false);
  }

  componentWillUnmount() {
    if (this.unsubscriber) {
      this.unsubscriber();
    }
  }

  render() {
    return <View style={styles.container} />;
  }
}
