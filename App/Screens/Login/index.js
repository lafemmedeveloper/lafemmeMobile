import {connect} from 'react-redux';
import Content from './Content';

import {setLoading, getDeviceInfo} from '../../Core/UI/Actions';

const mapStateToProps = ({ui}) => {
  const {loading, deviceInfo} = ui;
  console.log('ui', ui);
  console.log('loading', loading);
  console.log('deviceInfo', deviceInfo);
  return {
    loading,
    deviceInfo,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setLoading: state => dispatch(setLoading(state)),
    getDeviceInfo: () => dispatch(getDeviceInfo()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Content);
