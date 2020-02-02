import {connect} from 'react-redux';
import Content from './Content';

import {setLoading} from '../../Core/UI/Actions';

const mapStateToProps = ({ui, currentUser}) => {
  const {loading} = ui;
  const {user} = currentUser;
  return {
    loading,
    user,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setLoading: state => dispatch(setLoading(state)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Content);
