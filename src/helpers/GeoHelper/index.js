import * as geolib from 'geolib';
import Geolocation from '@react-native-community/geolocation';

const config = {
  //   skipPermissionRequests: false,
  //   authorizationLevel: 'auto'
};

Geolocation.setRNConfiguration(config);

export const getCurrentLocation = async () => {
  Geolocation.getCurrentPosition(
    (position) => {
      const initialPosition = JSON.stringify(position);

      return initialPosition;
    },
    (error) => console.log(JSON.stringify(error)),
    {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
  );
};

export const getDistance = (user, place) => {
  const distance = geolib.getDistance(user, place);
  return distance;
};

export const validateCoverage = (latitude, longitude, coverageZones) => {
  let isCoverage = false;
  let name = [];
  for (let index = 0; index < coverageZones.length; index++) {
    if (isCoverage === false) {
      isCoverage = geolib.isPointInPolygon(
        {latitude, longitude},
        coverageZones[index].coordinates,
      );
      if (
        geolib.isPointInPolygon(
          {latitude, longitude},
          coverageZones[index].coordinates,
        )
      ) {
        name.push(coverageZones[index].name);
      }
    }
  }

  return {isCoverage, name};
};

const TYPES_FILTER = [
  'locality',
  'neighborhood',
  'political',
  'administrative_area_level_3',
  'administrative_area_level_2',
  'administrative_area_level_1',
];

export const filterResultsByTypes = (unfilteredResults) => {
  const results = [];
  for (let i = 0; i < unfilteredResults.length; i++) {
    let found = false;

    for (let j = 0; j < TYPES_FILTER.length; j++) {
      if (unfilteredResults[i].types.indexOf(TYPES_FILTER[j]) !== -1) {
        found = true;
        break;
      }
    }

    if (found === true) {
      results.push(unfilteredResults[i]);
    }
  }

  let data = {};
  if (results.length > 0) {
    for (let index = 0; index < results.length; index++) {
      let doc = results[index];
      let key = doc.types[0];
      let value = doc.long_name;
      let item = {[key]: value};

      data = {...data, ...item};
    }
  }

  return data;
};
