import {combineReducers} from 'redux';

import UI from './UI/Reducer';
import Places from './Places/Reducer';
import Cities from './Cities/Reducer';
export default () =>
  combineReducers({
    ui: UI,
    cities: Cities,
    places: Places,
  });
