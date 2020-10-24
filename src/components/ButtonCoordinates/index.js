import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {Colors} from '../../themes';
import Geolocation from '@react-native-community/geolocation';
import Geocode from 'react-geocode';

const ButtonCoordinates = (props) => {
  const {
    setCoordinate,
    APIKEY,
    checkCoverage,
    setGoogleAddress,
    setCurrentLocationActive,
    activeApi,
    setName,
  } = props;

  const [activeCoor, setActiveCoor] = useState(null);

  const updateCoordinate = () => {
    Geolocation.getCurrentPosition((info) => activeLocation(info));
  };

  const activeLocation = async (info) => {
    setActiveCoor(info);
    fullState(info);
  };
  const fullState = async (info) => {
    Geocode.setApiKey(APIKEY);
    Geocode.setLanguage('es');
    Geocode.setRegion('co');
    Geocode.enableDebug();

    setCurrentLocationActive(true);
    setCoordinate({
      latitude: info.coords.latitude,
      longitude: info.coords.longitude,
    });

    await Geocode.fromLatLng(info.coords.latitude, info.coords.longitude).then(
      async (response) => {
        const address = response.results[0].formatted_address;
        setGoogleAddress(address);
        setName(address);
        await activeApi({
          latitude: info.coords.latitude,
          longitude: info.coords.longitude,
        });
        checkCoverage(info.coords.latitude, info.coords.longitude);
      },
      (error) => {
        console.error('error fullState==>', error);
      },
    );
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
