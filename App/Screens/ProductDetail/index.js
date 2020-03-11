import {connect} from 'react-redux';
import Content from './Content';

import {setLoading} from '../../Core/UI/Actions';
import {updateProfile} from '../../Core/User/Actions';

const mapStateToProps = ({ui, services, currentUser}) => {
  const {loading} = ui;
  const {auth, user} = currentUser;
  return {
    loading,
    services: services.services,
    auth,
    user,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setLoading: state => dispatch(setLoading(state)),
    updateProfile: (data, typeData) => dispatch(updateProfile(data, typeData)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Content);
