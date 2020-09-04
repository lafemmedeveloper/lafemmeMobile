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
    setGoogleDetail,
    setGoogleAddress,
    setCurrentLocationActive,
  } = props;

  const [activeCoor, setActiveCoor] = useState(null);

  const updateCoordinate = () => {
    Geocode.setApiKey(APIKEY);
    Geocode.setLanguage('es');
    Geocode.setRegion('co');
    Geocode.enableDebug();
    Geolocation.getCurrentPosition((info) => activeLocation(info));
  };

  const activeLocation = async (info) => {
    console.log('info =>', info);
    setActiveCoor(info);
    fullState(info);
  };
  const fullState = (info) => {
    setCurrentLocationActive(true);
    setCoordinate({
      latitude: info.coords.latitude,
      longitude: info.coords.longitude,
    });

    Geocode.fromLatLng(info.coords.latitude, info.coords.longitude).then(
      (response) => {
        setGoogleAddress(response);
        console.log('response ==> fullState', response);

        const address = response.results[0].formatted_address;
        console.log('address ==>', address);
        setGoogleDetail(address);
      },
      (error) => {
        console.error('error fullState==>', error);
      },
    );

    checkCoverage(info.coords.latitude, info.coords.longitude);
  };

  console.log('activeCoor =>', activeCoor);

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
