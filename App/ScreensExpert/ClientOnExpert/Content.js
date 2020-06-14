import React, {Component} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';

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
