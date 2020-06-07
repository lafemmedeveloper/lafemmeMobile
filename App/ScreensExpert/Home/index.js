import {connect} from 'react-redux';
import Content from './Content';

import {setLoading, getDeviceInfo} from '../../Core/UI/Actions';
import {
  getServices,
  getExpertOpenOrders,
  getExpertActiveOrders,
  getExpertHistoryOrders,
  assignExpert,
} from '../../Core/Services/Actions';
import {setAuth, logOut} from '../../Core/User/Actions';

const mapStateToProps = ({ui, currentUser, services}) => {
  const {loading, deviceInfo} = ui;
  const {auth, user} = currentUser;
  const {appType} = deviceInfo;
  return {
    loading,
    user,
    auth,
    appType,
    services: services.services,
    orders: services.orders,
    expertOpenOrders: services.expertOpenOrders,
    expertActiveOrders: services.expertActiveOrders,
    deviceInfo,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setLoading: state => dispatch(setLoading(state)),
    getServices: () => dispatch(getServices()),
    getExpertOpenOrders: () => dispatch(getExpertOpenOrders()),
    assignExpert: (orderId, orderIndex, expertData, clientToken) =>
      dispatch(assignExpert(orderId, orderIndex, expertData, clientToken)),
    getExpertActiveOrders: () => dispatch(getExpertActiveOrders()),
    getExpertHistoryOrders: () => dispatch(getExpertHistoryOrders()),
    getDeviceInfo: () => dispatch(getDeviceInfo()),
    setAuth: user => dispatch(setAuth(user)),
    logOut: () => dispatch(logOut()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Content);
