import {connect} from 'react-redux';
import Content from './Content';

import {setLoading, getDeviceInfo} from '../../Core/UI/Actions';
import {setAuth, setAccount, logOut} from '../../Core/User/Actions';

const mapStateToProps = ({ui, currentUser}) => {
  const {loading, deviceInfo} = ui;
  const {auth, user} = currentUser;
  return {
    loading,
    user,
    auth,
    deviceInfo,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setLoading: state => dispatch(setLoading(state)),
    getDeviceInfo: () => dispatch(getDeviceInfo()),
    setAuth: user => dispatch(setAuth(user)),
    setAccount: uid => dispatch(setAccount(uid)),
    logOut: uid => dispatch(logOut()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Content);
