import {connect} from 'react-redux';
import Content from './Content';

import {setLoading, setTempRegister} from '../../Core/UI/Actions';

const mapStateToProps = ({ui}) => {
  const {loading} = ui;

  return {
    loading,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setLoading: state => dispatch(setLoading(state)),
    setTemsetTempRegisterpData: date => dispatch(setTempRegister(date)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Content);
