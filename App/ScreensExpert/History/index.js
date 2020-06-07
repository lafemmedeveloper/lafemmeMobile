import {connect} from 'react-redux';
import Content from './Content';

import {setAuth, setAccount, logOut} from '../../Core/User/Actions';
import {setLoading, getDeviceInfo} from '../../Core/UI/Actions';

const mapStateToProps = ({ui, currentUser, services}) => {
  const {loading, deviceInfo} = ui;
  const {auth, user} = currentUser;
  const {appType} = deviceInfo;
  return {
    user,
    auth,
    loading,
    deviceInfo,
    appType,
    expertActiveOrders: services.expertActiveOrders,
    expertHistoryOrders: services.expertHistoryOrders,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setLoading: state => dispatch(setLoading(state)),
    getDeviceInfo: () => dispatch(getDeviceInfo()),

    setAuth: user => dispatch(setAuth(user)),
    setAccount: uid => dispatch(setAccount(uid)),
    logOut: () => dispatch(logOut()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Content);
