import * as geolib from 'geolib';
import Geolocation from '@react-native-community/geolocation';

const config = {
  //   skipPermissionRequests: false,
  //   authorizationLevel: 'auto'
};

Geolocation.setRNConfiguration(config);

export const getCurrentLocation = async () => {
  Geolocation.getCurrentPosition(
    position => {
      const initialPosition = JSON.stringify(position);

      return initialPosition;
    },
    error => console.log(JSON.stringify(error)),
    {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
  );
};

export const getDistance = (user, place) => {
  const distance = geolib.getDistance(user, place);
  return distance;
};
