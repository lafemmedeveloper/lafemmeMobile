import {GET_CITIES} from './Types';
import apisauce from 'apisauce';

export const getCities = query => dispatch => {
  const api = apisauce.create({
    baseURL: `https://developers.zomato.com/api/v2.1/locations?&count=5&query=${query}`,
    headers: {
      Accept: 'application/json',
      'user-key': '53901f7560f04951ebf26911dbc43727',
    },
    timeout: 20000,
  });

  return api.get().then(result => {
    const cities = result.data.location_suggestions.map(item => {
      return new Promise(resolve => {
        resolve({
          ...item,
        });
      });
    });

    Promise.all(cities).then(response => {
      return dispatch({type: GET_CITIES, payload: response});
    });
  });
};
