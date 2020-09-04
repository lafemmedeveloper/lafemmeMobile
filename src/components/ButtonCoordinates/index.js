import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {Colors} from '../../themes';
import GetLocation from 'react-native-get-location';

const ButtonCoordinates = async () => {
  const updateCoordinate = () => {
    try {
      GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 15000,
      })
        .then((location) => {
          console.log('location ==>', location);
        })
        .catch((error) => {
          const {code, message} = error;
          console.warn('error updateCoordinate => code', error, message, code);
        });
    } catch (error) {
      console.log('error');
    }
  };
  return (
    <>
      <TouchableOpacity
        style={styles.ContIcon}
        onPress={() => updateCoordinate()}>
        <Icon
          name={'crosshairs-gps'}
          size={30}
          color={Colors.client.primaryColor}
          style={{zIndex: 5000, alignSelf: 'center'}}
        />
      </TouchableOpacity>
    </>
  );
};
const styles = StyleSheet.create({
  ContIcon: {
    backgroundColor: 'white',
    height: 40,
    width: 40,
    alignSelf: 'center',
    flex: 0,
    zIndex: 5000,
    justifyContent: 'center',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
  },
});

export default ButtonCoordinates;
