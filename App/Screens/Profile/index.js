import {connect} from 'react-redux';
import Content from './Content';

import {setLoading} from '../../Core/UI/Actions';
import {
  setAuth,
  setAccount,
  updateProfile,
  setTempRegister,
  logOut,
} from '../../Core/User/Actions';

const mapStateToProps = ({ui, currentUser}) => {
  const {loading, deviceInfo} = ui;
  const {user} = currentUser;
  const {appType} = deviceInfo;

  return {
    loading,
    user,
    deviceInfo,
    appType,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setLoading: state => dispatch(setLoading(state)),
    logOut: uid => dispatch(logOut()),
    setAuth: user => dispatch(setAuth(user)),
    setTempRegister: date => dispatch(setTempRegister(date)),
    setAccount: uid => dispatch(setAccount(uid)),
    updateProfile: (data, typeData) => dispatch(updateProfile(data, typeData)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Content);
