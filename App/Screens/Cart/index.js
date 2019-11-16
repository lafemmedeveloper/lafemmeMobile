import {connect} from 'react-redux';
import Content from './Content';

import {setLoading} from '../../Core/UI/Actions';
import {getCoverage} from '../../Core/Services/Actions';

const mapStateToProps = ({ui, currentUser, services}) => {
  const {loading} = ui;
  const {auth, user} = currentUser;
  return {
    loading,
    user,
    auth,
    coverageZones: services.coverageZones,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setLoading: state => dispatch(setLoading(state)),
    getCoverage: city => dispatch(getCoverage(city)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Content);
