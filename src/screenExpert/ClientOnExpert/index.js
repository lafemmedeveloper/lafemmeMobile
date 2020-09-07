import React from 'react';
import {Text, View, TouchableOpacity, StyleSheet} from 'react-native';
import {Metrics, Colors} from '../../themes';

const logoutAction = () => {
  console.log('cerrar sesion');
};

const ClientOnExpert = () => {
  return (
    <View style={styles.container}>
      <Text>Lo sentimos, no tienes acceso a esta seccion.</Text>
      <Text>Te invitamos a descargtar nuestra App de clientes.</Text>

      <TouchableOpacity onPress={() => logoutAction()}>
        <Text>La Femme Clientes</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => logoutAction()}>
        <Text>Cerrar Sesion.</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: Metrics.screenWidth,
    height: Metrics.screenHeight,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.snow,
  },
});

export default ClientOnExpert;
