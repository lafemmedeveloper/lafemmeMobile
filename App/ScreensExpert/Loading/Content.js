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

export default class Loading extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    console.log('componentDidMount:Loading');

    const {
      navigation,
      getDeviceInfo,
      setAuth,
      setAccount,
      setLoading,
      user,
    } = this.props;

    console.log('props', this.props);

    setLoading(true);
    await getDeviceInfo();

    if (!auth().currentUser) {
      navigation.navigate('Login');
    }

    this.unsubscriber = auth().onAuthStateChanged(async authUser => {
      console.log('user:unsuscriber', authUser);
      // console.log('user:auth().currentUser', auth().currentUser.uid);

      if (auth().currentUser && auth().currentUser.uid) {
        console.log('user:loading', authUser);
        await setAuth(authUser);

        if (auth().currentUser && auth().currentUser.uid && user == null) {
          console.log('=> auth().currentUser.uid', auth().currentUser.uid);
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
