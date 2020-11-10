import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {Colors} from '../../themes';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ButtonCoordinate = (props) => {
  const {activeCoor} = props;

  return (
    <TouchableOpacity style={styles.container} onPress={() => activeCoor()}>
      <Icon name="crosshairs-gps" size={20} color={Colors.dark} />
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light,
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',

    borderRadius: 50,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,

    elevation: 6,
  },
});
export default ButtonCoordinate;
