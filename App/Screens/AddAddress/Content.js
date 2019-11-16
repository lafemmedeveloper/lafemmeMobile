import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import firestore from '@react-native-firebase/firestore';
import {Colors, Images, Fonts, ApplicationStyles, Metrics} from '../../Themes';
import auth from '@react-native-firebase/auth';
import MyTextInput from '../../Components/MyTextInput';
import CardItemAddress from '../../Components/CardItemAddress';
import FieldCartConfig from '../../Components/FieldCartConfig';
import styles from './styles';
import {ScrollView} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import Modal from 'react-native-modal';
import {validateCoverage} from '../../Helpers/GeoHelper';

import Loading from '../Loading';
import {msToDate, msToDay, msToHour} from '../../Helpers/MomentHelper';
export default class Address extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {}

  checkCoverage() {
    const {coverageZones} = this.props;
    validateCoverage(6.1367078, -75.6324356, coverageZones);
  }

  render() {
    const {user} = this.props;

    return (
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <View ref={'headerContainer'} style={styles.headerContainer}>
            <View opacity={0.0} style={ApplicationStyles.separatorLine} />
            <Text
              style={Fonts.style.bold(Colors.dark, Fonts.size.h6, 'center')}>
              {'Agregar Nueva direccion'}
            </Text>
            <View opacity={0.0} style={ApplicationStyles.separatorLine} />
          </View>

          <View style={styles.containerAddress}>
            <GooglePlacesAutocomplete
              placeholder={'Escribe tu direccion'}
              minLength={4} // minimum length of text to search
              autoFocus={false}
              returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
              keyboardAppearance={'light'} // Can be left out for default keyboardAppearance https://facebook.github.io/react-native/docs/textinput.html#keyboardappearance
              listViewDisplayed={'auto'} // true/false/undefined
              fetchDetails={true}
              renderDescription={row => row.description} // custom description render
              onPress={(data, details = null) => {
                // 'details' is provided when fetchDetails = true
                console.log(data, details);
              }}
              getDefaultValue={() => ''}
              query={{
                // available options: https://developers.google.com/places/web-service/autocomplete
                key: 'AIzaSyBX9OXlxkA18EWnRrg6bzgWuQkHbTVx1aI',
                language: 'es', // language of the results
                types: 'geocode', // default: 'geocode'
                components: 'country:co',
                location: '6.2690007,-75.7364792',
                radius: '55000', //15 km
                strictbounds: true,
              }}
              styles={{
                textInputContainer: {
                  width: '100%',
                  height: 60,
                  backgroundColor: Colors.light,
                },
                poweredContainer: {
                  height: 30,
                  borderBottomLeftRadius: Metrics.borderRadius,
                  borderBottomRightRadius: Metrics.borderRadius,
                },
                powered: {width: 100, height: 50},
                textInput: {height: 40, backgroundColor: Colors.textInputBg},
                row: {
                  padding: 5,
                  height: 30,
                  flexDirection: 'row',
                },
                description: {
                  fontWeight: '400',
                },
                predefinedPlacesDescription: {
                  color: '#1faadb',
                },
              }}
              currentLocation={false} // Will add a 'Current location' button at the top of the predefined places list
              currentLocationLabel={'Mi ubicacion actual'}
              nearbyPlacesAPI={'GooglePlacesSearch'} // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
              GoogleReverseGeocodingQuery={
                {
                  // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
                }
              }
              GooglePlacesSearchQuery={{
                // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
                rankby: 'distance',
                type: 'cafe',
              }}
              GooglePlacesDetailsQuery={{
                // available options for GooglePlacesDetails API : https://developers.google.com/places/web-service/details
                fields: 'formatted_address',
              }}
              filterReverseGeocodingByTypes={[
                'locality',
                'administrative_area_level_3',
              ]} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
              debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
              renderLeftButton={() => (
                <View
                  style={{
                    marginHorizontal: 5,
                    justifyContent: 'center',
                  }}>
                  <Icon
                    name={'map-marker-alt'}
                    size={25}
                    color={Colors.client.primartColor}
                  />
                </View>
              )}
              // renderRightButton={() => <Text>Custom text after the input</Text>}
            />
          </View>

          <View
            style={{
              width: Metrics.screenWidth,
              flex: 1,
              backgroundColor: 'purple',
            }}>
            <TouchableOpacity
              onPress={() => {
                this.checkCoverage();
              }}>
              <Text>getCoverage</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}
