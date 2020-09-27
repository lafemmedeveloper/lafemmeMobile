import React from 'react';
import {Text} from 'react-native';
/* Status */
import SerchExpert from './SerchExpert';
import Preparing from './Preparing';
import OnRoute from './OnRoute';
import OnService from './OnService';
import Qualification from './Qualification';
import ServiceFinish from './ServiceFinish';
import Finish from './Finish';
import Cancelled from './Cancelled';

const Status = ({status, id, goBack, expert, orderId}) => {
  switch (status) {
    case 0:
      return <SerchExpert />;

    case 1:
      return <Preparing id={id} />;

    case 2:
      return <OnRoute id={id} />;

    case 3:
      return <OnService id={id} />;

    case 4:
      return <ServiceFinish id={id} goBack={goBack} />;

    case 5:
      return <Qualification id={orderId} expert={expert} goBack={goBack} />;

    case 6:
      return <Finish />;

    case 7:
    case 8:
      return <Cancelled />;

    default:
      return <Text>Hello world</Text>;
  }
};

export default Status;
