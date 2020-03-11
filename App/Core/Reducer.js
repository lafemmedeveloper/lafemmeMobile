import {combineReducers} from 'redux';

import UI from './UI/Reducer';
import Services from './Services/Reducer';
import User from './User/Reducer';

export default () =>
  combineReducers({
    ui: UI,
    currentUser: User,
    services: Services,
  });
