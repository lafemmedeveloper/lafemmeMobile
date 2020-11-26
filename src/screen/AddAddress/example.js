<GooglePlacesAutocomplete
  placeholder={'Ej: Ciudad, barrio, dirección, lugar...'}
  autoFocus={false}
  returnKeyType={'search'}
  keyboardAppearance={'light'}
  fetchDetails={true}
  renderDescription={(row) => row.description}
  onPress={(data, details) => {
    console.log('AddressModal -> details', details);
    console.log('AddressModal -> data', data);

    console.log(
      'AddressModal -> details',
      filterResultsByTypes(details.address_components),
    );

    setLocationFilter({
      formatted_address: details.formatted_address,
      vicinity: details.vicinity,
      coordinates: {
        latitud: details.geometry.location.lat,
        longitude: details.geometry.location.lng,
      },
    });

    handleAddress({
      formatted_address: details.formatted_address,
      vicinity: details.vicinity,
      coordinates: {
        latitud: details.geometry.location.lat,
        longitude: details.geometry.location.lng,
      },
    });

    navigation.goBack();
  }}
  getDefaultValue={() => ''}
  query={{
    key: 'AIzaSyDDVtbegw2rVFZ-rsymT01rG22jFSfR43Q',
    language: 'es',
    types: 'geocode',
    components: 'country:co',
    location: '6.2690007,-75.734792',
    radius: '55000',
    strictbounds: true,
  }}
  textInputProps={{
    onChangeText: (text) => {
      setListActive(text.length);
    },
  }}
  onFail={(error) => console.log('AddressModal -> onFail', error)}
  onNotFound={(error) => console.log('AddressModal -> onNotFound', error)}
  nearbyPlacesAPI={'GooglePlacesSearch'}
  GooglePlacesDetailsQuery={{
    fields: ['formatted_address', 'geometry', 'vicinity'],
  }}
  filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']}
  debounce={200}
/>;
