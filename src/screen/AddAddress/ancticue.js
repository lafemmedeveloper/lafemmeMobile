<GooglePlacesAutocomplete
  placeholder={'(Ej: carrera 33 #10-20)'}
  autoFocus={false}
  returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
  keyboardAppearance={'light'} // Can be left out for default keyboardAppearance https://facebook.github.io/react-native/docs/textinput.html#keyboardappearance
  listViewDisplayed={false} // true/false/undefined
  fetchDetails={true}
  renderDescription={(row) => row.description} // custom description render
  onPress={(data, details = null) => updateLocation(data, details)}
  query={{
    // available options: https://developers.google.com/places/web-service/autocomplete
    key: APIKEY,
    language: 'es', // language of the results
    types: 'geocode', // default: 'geocode'
    components: 'country:co',
    location: '6.2690007,-75.734792',
    radius: '55000', //15 km
    strictbounds: true,
  }}
  styles={{
    textInputContainer: {
      backgroundColor: Colors.light,
      borderTopColor: 'transparent',
      borderBottomColor: 'transparent',
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,

      elevation: 5,
    },
    poweredContainer: {
      height: 30,
      borderBottomLeftRadius: Metrics.borderRadius,
      borderBottomRightRadius: Metrics.borderRadius,
    },
    row: {
      padding: 5,
      height: 30,
      flexDirection: 'row',
      backgroundColor: Colors.light,
    },
    description: {
      fontWeight: '400',
    },
  }}
  currentLocation={false} // Will add a 'Current location' button at the top of the predefined places list
  currentLocationLabel={'Mi ubicación actual'}
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
  filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']}
  // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
  debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
/>;

const updateLocation = async (data, details) => {
  const {structured_formatting} = data;
  const {main_text} = structured_formatting;

  Geocode.setApiKey(APIKEY);
  Geocode.setLanguage('es');
  Geocode.setRegion('co');
  Geocode.enableDebug();

  const addressSerch = details.formatted_address;

  setName(main_text);
  await Geocode.fromAddress(addressSerch).then(
    (response) => {
      const dataResponse = response.results[0];
      const {lat, lng} = dataResponse.geometry.location;
      activeApi({
        latitude: lat,
        longitude: lng,
      });
      setCoordinate({
        latitude: lat,
        longitude: lng,
      });

      setGoogleAddress(addressSerch);
    },
    (error) => {
      console.error('error updateLocation =>', error);
    },
  );
};
