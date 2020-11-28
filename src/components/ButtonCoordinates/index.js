import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {Colors} from '../../themes';
import Geolocation from '@react-native-community/geolocation';
import Geocode from 'react-geocode';
import {filterResultsByTypes} from '../../helpers/GeoHelper';

const ButtonCoordinates = ({
  activeApi,
  setName,
  setCoordinate,
  APIKEY,
  checkCoverage,
  setGoogleAddress,
  setCurrentLocationActive,
  setGoogleDetail,
}) => {
  const updateCoordinate = () => {
    Geolocation.getCurrentPosition((info) => activeLocation(info));
  };

  const activeLocation = async (info) => {
    fullState(info);
  };
  const fullState = async (info) => {
    setCurrentLocationActive(true);

    Geocode.setApiKey(APIKEY);
    Geocode.setLanguage('es');
    Geocode.setRegion('co');
    Geocode.enableDebug();

    setCoordinate({
      latitude: info.coords.latitude,
      longitude: info.coords.longitude,
    });

    await Geocode.fromLatLng(info.coords.latitude, info.coords.longitude)
      .then(async (response) => {
        const address = response.results[0].formatted_address;
        setGoogleAddress(address);
        setName(address);
        const result = await filterResultsByTypes(response.results);
        setGoogleDetail({
          ...result,
        });
        await checkCoverage(info.coords.latitude, info.coords.longitude);
      })
      .catch((error) => {
        console.log('fullState:error', error);
      });
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
    height: 40,
    width: 40,
    borderRadius: 20,
    alignSelf: 'center',
    flex: 0,
    zIndex: 25,
    justifyContent: 'center',
    backgroundColor: Colors.light,
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

export default ButtonCoordinates;
