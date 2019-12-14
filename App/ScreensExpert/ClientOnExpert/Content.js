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
    const {setLoading} = this.props;
    console.log('setLoading:false');
    setLoading(false);
  }
  async logoutAction() {
    const {logOut} = this.props;
    console.log('logOut');
    logOut();
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Lo sentimos, no tienes acceso a esta seccion.</Text>
        <Text>Te invitamos a descargtar nuestra App de clientes.</Text>

        <TouchableOpacity
          onPress={() => {
            this.logoutAction();
          }}>
          <Text>La Femme Clientes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            this.logoutAction();
          }}>
          <Text>Cerrar Sesion.</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
