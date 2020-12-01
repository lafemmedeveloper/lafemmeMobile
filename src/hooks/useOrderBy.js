import {useEffect, useState, useCallback, useRef} from 'react';
import _ from 'lodash';

export const useOrderBy = (services, logicMove) => {
  const isMountedRef = useRef(null);
  const [servicesOrderBy, setServicesOrderBy] = useState([]);

  const actionOrderBy = useCallback(() => {
    if (logicMove) {
      let currentService = services;
      for (let i = 0; i < services.length; i++) {
        if (logicMove === 'up') {
          currentService[i++];
          logicMove[logicMove++];
        } else {
          currentService[i--];
          logicMove[logicMove--];
        }
      }
    }

    setServicesOrderBy(services);
  }, [services, logicMove]);

  useEffect(() => {
    isMountedRef.current = true;
    actionOrderBy();
    return () => {
      return () => (isMountedRef.current = false);
    };
  }, [actionOrderBy]);

  return [_.orderBy(servicesOrderBy, 'order')];
};
