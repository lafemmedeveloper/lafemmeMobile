import {connect} from 'react-redux';
import Content from './Content';

import {setLoading, getDeviceInfo} from '../../Core/UI/Actions';
import {
  getServices,
  getOrders,
  getCoverage,
  getGallery,
} from '../../Core/Services/Actions';
import {
  setAuth,
  setAccount,
  updateProfile,
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
    services: services.services,
    orders: services.orders,
    gallery: services.gallery,
    deviceInfo,
    appType,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setLoading: state => dispatch(setLoading(state)),
    getServices: () => dispatch(getServices()),

    getGallery: () => dispatch(getGallery()),
    getOrders: () => dispatch(getOrders()),
    updateProfile: (data, typeData) => dispatch(updateProfile(data, typeData)),
    getDeviceInfo: () => dispatch(getDeviceInfo()),
    setAuth: user => dispatch(setAuth(user)),
    setAccount: uid => dispatch(setAccount(uid)),
    logOut: uid => dispatch(logOut()),
    getCoverage: city => dispatch(getCoverage(city)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Content);
