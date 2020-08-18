import React, {createContext, useReducer} from 'react';
import authReducer, {INITIAL_STATE_AUTH} from './auth/reducer';
import serviceReducer, {INITIAL_STATE_SERVICES} from './services/reducer';
import utilReducer, {INITIAL_STATE_UTIL} from './util/reducer';

export const StoreContext = createContext({});

export default (props) => {
  const [auth, authDispatch] = useReducer(authReducer, INITIAL_STATE_AUTH);
  const [service, serviceDispatch] = useReducer(
    serviceReducer,
    INITIAL_STATE_SERVICES,
  );
  const [util, utilDispatch] = useReducer(utilReducer, INITIAL_STATE_UTIL);

  return (
    <StoreContext.Provider
      value={{
        state: {auth, service, util},
        authDispatch,
        serviceDispatch,
        utilDispatch,
      }}>
      {props.children}
    </StoreContext.Provider>
  );
};
