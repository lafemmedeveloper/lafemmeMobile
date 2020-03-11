import {GET_PLACES} from './Types';
import apisauce from 'apisauce';

export const getPlaces = (lat, long) => dispatch => {
  const api = apisauce.create({
    baseURL: `https://developers.zomato.com/api/v2.1/geocode??lat=${lat}&lon=${long}`,
    headers: {
      Accept: 'application/json',
      'user-key': '53901f7560f04951ebf26911dbc43727',
    },
    timeout: 20000,
  });

  return api.get().then(result => {
    const places = result.data.nearby_restaurants.map(item => {
      return new Promise(resolve => {
        resolve({
          ...item,
        });
      });
    });

    Promise.all(places).then(response => {
      return dispatch({type: GET_PLACES, payload: response});
    });
  });
};
