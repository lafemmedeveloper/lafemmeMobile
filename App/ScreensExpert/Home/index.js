import {connect} from 'react-redux';
import Content from './Content';

import {setLoading, getDeviceInfo} from '../../Core/UI/Actions';
import {getServices, getExpertOpenOrders} from '../../Core/Services/Actions';
import {setAuth, setAccount, logOut} from '../../Core/User/Actions';

const mapStateToProps = ({ui, currentUser, services}) => {
  const {loading, deviceInfo} = ui;
  const {auth, user} = currentUser;

  return {
    loading,
    user,
    auth,
    services: services.services,
    orders: services.orders,
    expertOpenOrders: services.expertOpenOrders,
    deviceInfo,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setLoading: state => dispatch(setLoading(state)),
    getServices: () => dispatch(getServices()),

    getExpertOpenOrders: () => dispatch(getExpertOpenOrders()),

    getDeviceInfo: () => dispatch(getDeviceInfo()),
    setAuth: user => dispatch(setAuth(user)),
    setAccount: () => dispatch(setAccount()),
    logOut: () => dispatch(logOut()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Content);
