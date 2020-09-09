import React from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Colors} from '../../../../themes';

const ButtonCoordinate = () => {
  return (
    <>
      <TouchableOpacity
        onPress={() => console.log('hola')}
        style={styles.iconRunning}>
        <Icon name={'crosshairs-gps'} size={20} color={Colors.dark} />
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  iconRunning: {
    backgroundColor: Colors.light,
    height: 50,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,

    elevation: 10,
  },
});

export default ButtonCoordinate;
