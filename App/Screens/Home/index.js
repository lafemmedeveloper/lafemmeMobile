import {connect} from 'react-redux';
import Content from './Content';

import {setLoading} from '../../Core/UI/Actions';
import {getPlaces} from '../../Core/Places/Actions';
import {getCities} from '../../Core/Cities/Actions';

const mapStateToProps = ({ui, places, cities}) => {
  const {loading} = ui;

  return {
    loading,
    places: places.places,
    cities: cities.cities,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setLoading: state => dispatch(setLoading(state)),
    getPlaces: (lat, long) => dispatch(getPlaces(lat, long)),
    getCities: query => dispatch(getCities(query)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Content);
