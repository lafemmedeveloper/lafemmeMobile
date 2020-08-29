import React, {useState, useContext} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {Colors, Fonts, Metrics} from '../../themes';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import Icon from 'react-native-vector-icons/FontAwesome5';

import {validateCoverage} from '../../helpers/GeoHelper';

import Utilities from '../../utilities';
import {updateProfile} from '../../flux/auth/actions';
import {StoreContext} from '../../flux';
import Geocode from 'react-geocode';
import ModalApp from '../../components/ModalApp';
import EnableCoverage from './EnableCoverage';
import NoEnableCoverage from './NoEnableCoverage';

const AddAddress = (props) => {
  const {closeAddAddress} = props;
  const APIKEY = 'AIzaSyArVhfk_wHVACPwunlCi1VP9EUgYZcnFpQ';
  const {state, authDispatch} = useContext(StoreContext);
  const {auth, util} = state;
  const {user} = auth;
  const {coverageZones} = util;
  console.log('coverageZones ==>', coverageZones);

  const mapStyle = require('../../config/mapStyle.json');
  const screen = Dimensions.get('window');
  const ASPECT_RATIO = screen.width * 0.8 - 500 / screen.height;
  const LATITUDE_DELTA = 0.0003;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

  let addresStatus = {
    searching: 0,
    coverage: 1,
    noCoverage: 2,
  };

  let locationType = {
    house: 0,
    office: 1,
    hotel: 2,
    otro: 3,
  };

  const [googleAddress, setGoogleAddress] = useState(null);
  const [isCoverage, setIsCoverage] = useState(addresStatus.searching);
  const [notifyCoverage, setNotifyCoverage] = useState(true);
  const [buildType, setBuildType] = useState(locationType.house);
  const [addressDetail, setAddressDetail] = useState('');
  const [notesAddress, setNotesAddress] = useState('');
  const [coordinate, setCoordinate] = useState({
    latitude: 6.2458077,
    longitude: -75.5680703,
  });

  const checkCoverage = (latitude, longitude) => {
    let coverage = validateCoverage(latitude, longitude, coverageZones);

    setIsCoverage(coverage ? addresStatus.coverage : addresStatus.noCoverage);

    console.log('coverage=>', isCoverage);
  };

  const saveAddress = () => {
    const address_components = googleAddress.formatted_address;
    console.log('address_components ==>', address_components);

    let item = {
      type: buildType,
      name: googleAddress.name,
      addressDetail: addressDetail,
      notesAddress: notesAddress,
      coordinates: {
        latitude: coordinate.latitude,
        longitude: coordinate.longitude,
      },
      formattedAddress: googleAddress.formatted_address,
      idAddress: googleAddress.id,
      id: Utilities.create_UUID(),
      vicinity: googleAddress.vicinity,
      url: googleAddress.url,
    };

    let address = [...user.address, item];

    console.log('address ==>', address);

    updateProfile(address, 'address', authDispatch);

    setIsCoverage(addresStatus.searching);
    closeAddAddress(false);
  };

  const updateLocation = (data, details) => {
    Geocode.setApiKey(APIKEY);
    Geocode.setLanguage('es');
    Geocode.setRegion('co');
    Geocode.enableDebug();

    console.log('data ==>', data);
    setGoogleAddress(details);
    const addressSerch = details.formatted_address;

    Geocode.fromAddress(addressSerch).then(
      (response) => {
        const {lat, lng} = response.results[0].geometry.location;
        console.log('location =>', lat, lng);
        setCoordinate({
          latitude: lat,
          longitude: lng,
        });
      },
      (error) => {
        console.error(error);
      },
    );
  };
  const closeModalCoverage = (data) => {
    if (!data) {
      setIsCoverage(addresStatus.searching);
    } else {
      setIsCoverage(addresStatus.searching);
    }
  };
  return (
    <>
      <View
        style={{
          position: 'absolute',
          width: '90%',
          justifyContent: 'center',
          bottom: 100,
          zIndex: 10000,
          alignSelf: 'center',
        }}>
        <GooglePlacesAutocomplete
          placeholder={'Escribe tu direccion (ej: carrera 33 #10-20)'}
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
              backgroundColor: 'white',
              width: '100%',

              borderRadius: 10,
              borderTopColor: 'white',
              borderBottomColor: 'white',
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
            powered: {width: 100, height: 50},

            row: {
              padding: 5,
              height: 30,
              flexDirection: 'row',
              backgroundColor: Colors.light,
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
          ]}
          // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
          debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
        />
      </View>
      <View style={{height: Metrics.header * 16.5}}>
        <MapView
          provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          style={{
            width: Metrics.screenWidth,
            height: Metrics.screenHeight,
          }}
          customMapStyle={mapStyle}
          mapPadding={{
            bottom: 10,
          }}
          initialRegion={{
            latitude: 6.2458077,
            longitude: -75.5680703,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }}
          region={{
            latitude: coordinate.latitude,
            longitude: coordinate.longitude,
            latitudeDelta: 0.00001,
            longitudeDelta: 0.00001 * ASPECT_RATIO,
          }}>
          <Marker.Animated
            coordinate={{
              latitude: coordinate.latitude,
              longitude: coordinate.longitude,
            }}>
            <Icon
              name={'map-marker-alt'}
              size={30}
              color={Colors.client.primaryColor}
            />
          </Marker.Animated>
        </MapView>
      </View>

      <TouchableOpacity
        disabled={!googleAddress}
        onPress={() => checkCoverage(coordinate.latitude, coordinate.longitude)}
        style={[
          styles.btnContainer,
          {
            position: 'absolute',
            bottom: 0,
            backgroundColor: googleAddress
              ? Colors.client.primaryColor
              : Colors.gray,
          },
        ]}>
        <Text
          style={Fonts.style.bold(Colors.light, Fonts.size.medium, 'center')}>
          {'Verificar Cobertura'}
        </Text>

        {/* Modals */}
      </TouchableOpacity>
      <ModalApp // false coverage
        open={isCoverage === addresStatus.noCoverage}
        setOpen={closeModalCoverage}>
        <NoEnableCoverage
          notifyCoverage={notifyCoverage}
          setIsCoverage={setIsCoverage}
          setNotifyCoverage={setNotifyCoverage}
        />
      </ModalApp>
      <ModalApp // true coverage
        open={isCoverage === addresStatus.coverage}
        setOpen={closeModalCoverage}>
        <EnableCoverage
          mapStyle={mapStyle}
          LATITUDE_DELTA={LATITUDE_DELTA}
          LONGITUDE_DELTA={LONGITUDE_DELTA}
          ASPECT_RATIO={ASPECT_RATIO}
          buildType={buildType}
          addressDetail={addressDetail}
          setAddressDetail={setAddressDetail}
          coordinate={coordinate}
          setBuildType={setBuildType}
          saveAddress={saveAddress}
          googleAddress={googleAddress}
          setNotesAddress={setNotesAddress}
        />
      </ModalApp>
      {/* Modals */}
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 0,
    width: Metrics.screenWidth,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemTitleContainer: {
    marginVertical: 5,
    width: Metrics.screenWidth * 0.9,
    alignSelf: 'center',
  },
  itemAddressContainer: {
    width: '90%',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemAddress: {
    flex: 1,
    borderRadius: Metrics.borderRadius,
    marginHorizontal: 2.5,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productContainer: {
    flex: 0,
    marginVertical: 2.5,
    borderRadius: Metrics.textInBr,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '90%',
    backgroundColor: Colors.textInputBg,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },

  containerAddress: {
    width: Metrics.screenWidth,
    flex: 0,
    marginTop: 60,
    zIndex: 1000,
    position: 'absolute',
  },
  headerContainer: {
    flex: 0,
    height: 70,
    width: Metrics.screenWidth,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    width: Metrics.screenWidth,
  },
  footerContainer: {
    flex: 0,
    flexDirection: 'row',
    width: Metrics.screenWidth,

    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  loading: {
    backgroundColor: Colors.loader,
    position: 'absolute',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: Metrics.screenHeight,
    width: Metrics.screenWidth,
    zIndex: 2000,
  },
  logo: {
    width: Metrics.screenWidth * 0.4,
    height: Metrics.screenWidth * 0.4,
    resizeMode: 'contain',
    marginTop: 10,
  },
  selectorContainer: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 20,
  },

  welcome: {
    fontFamily: Fonts.type.base,
    color: Colors.dark,
    marginVertical: 10,
    marginHorizontal: 20,
    fontSize: Fonts.size.h6,
    textAlignVertical: 'center',
    textAlign: 'center',
  },

  descriptorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  selectorText: {
    marginHorizontal: 20,
    fontFamily: Fonts.type.bold,
    color: Colors.dark,
    fontSize: Fonts.size.medium,
    textAlignVertical: 'center',
    textAlign: 'center',
  },
  btnText: {
    fontFamily: Fonts.type.bold,
    color: Colors.dark,
    fontSize: Fonts.size.medium,
    textAlignVertical: 'center',
    textAlign: 'center',
  },

  btnRegisterLogin: {
    flex: 0,
    width: Metrics.screenWidth / 2,
    height: 40,
    marginVertical: Metrics.addFooter * 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnContainer: {
    flex: 0,
    height: 60 + Metrics.addFooter,
    width: Metrics.screenWidth,
    alignSelf: 'center',
    borderTopLeftRadius: Metrics.borderRadius,
    borderTopRightRadius: Metrics.borderRadius,

    paddingBottom: Metrics.addFooter,

    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.client.primaryColor,
    shadowColor: Colors.dark,
    shadowOffset: {
      width: 2,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 1,

    elevation: 5,
  },
  linearGradient: {
    flex: 1,
    width: Metrics.screenWidth,
    height: Metrics.screenHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default AddAddress;
