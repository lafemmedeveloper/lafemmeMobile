import {connect} from 'react-redux';
import Content from './Content';

import {setLoading} from '../../Core/UI/Actions';

const mapStateToProps = ({ui}) => {
  const {loading} = ui;

  return {
    loading,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setLoading: state => dispatch(setLoading(state)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Content);
