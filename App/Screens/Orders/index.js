import {connect} from 'react-redux';
import Content from './Content';

import {setLoading} from '../../Core/UI/Actions';

import {getCoverage, getOrders, cancelOrder} from '../../Core/Services/Actions';
import {
  setAuth,
  setAccount,
  updateProfile,
  setTempRegister,
  logOut,
} from '../../Core/User/Actions';

const mapStateToProps = ({ui, currentUser, services}) => {
  const {loading, deviceInfo} = ui;
  const {auth, user} = currentUser;
  const {appType} = deviceInfo;
  return {
    loading,
    user,
    auth,
    coverageZones: services.coverageZones,
    orders: services.orders,
    history: services.history,
    deviceInfo,
    appType,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setLoading: state => dispatch(setLoading(state)),
    getCoverage: city => dispatch(getCoverage(city)),
    cancelOrder: orderId => dispatch(cancelOrder(orderId)),
    getOrders: () => dispatch(getOrders()),
    setTempRegister: date => dispatch(setTempRegister(date)),
    updateProfile: (data, typeData) => dispatch(updateProfile(data, typeData)),
    setAuth: user => dispatch(setAuth(user)),
    setAccount: uid => dispatch(setAccount(uid)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Content);
