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
import Login from '../../Screens/Login/Content';
import Register from '../../Screens/Register/Content';

export default class Loading extends Component {
  constructor(props) {
    super(props);
    this.state = {isLogin: true};
  }

  async componentDidMount() {
    console.log('componentDidMount:Loading');

    const {
      navigation,
      getDeviceInfo,
      setAuth,
      setAccount,
      setLoading,
    } = this.props;

    if (this.props.user) {
      navigation.navigate('Home');
    } else {
      setLoading(true);
      await getDeviceInfo();

      this.unsubscriber = auth().onAuthStateChanged(user => {
        if (user) {
          setAuth(user);
          if (auth().currentUser && auth().currentUser.uid && user == null) {
            this.callSetUser(auth().currentUser.uid);
          }
        }
      });

      if (auth().currentUser && auth().currentUser.uid) {
        // console.log(auth().currentUser);
        await setAccount(auth().currentUser.uid);
      }

      setLoading(false);
    }
  }

  async callSetUser(uid) {
    const {setAccount} = this.props;

    await setAccount(uid);
  }
  componentWillUnmount() {
    if (this.unsubscriber) {
      this.unsubscriber();
    }
  }

  render() {
    const {isLogin} = this.state;
    return (
      <View style={styles.container}>
        {isLogin && <Login isLogin={() => this.setState({isLogin: false})} />}
        {!isLogin && (
          <Register isLogin={() => this.setState({isLogin: true})} />
        )}
      </View>
    );
  }
}
