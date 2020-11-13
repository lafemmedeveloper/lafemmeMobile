import React, {useState, useContext, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  Alert,
} from 'react-native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {ApplicationStyles, Colors, Fonts, Images, Metrics} from '../../themes';
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
import {getCoverage} from '../../flux/util/actions';
import ButtonCoordinates from '../../components/ButtonCoordinates';

const AddAddress = ({setAddAddress}) => {
  const APIKEY = 'AIzaSyArVhfk_wHVACPwunlCi1VP9EUgYZcnFpQ';
  const {state, authDispatch, utilDispatch} = useContext(StoreContext);
  const {auth, util} = state;
  const {user} = auth;
  const {coverageZones} = util;

  const mapStyle = require('../../config/mapStyle.json');
  const screen = Dimensions.get('window');
  const ASPECT_RATIO = screen.width * 0.8 - 500 / screen.height;
  const LATITUDE_DELTA = 0.0003;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

  let addressStatus = {
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
  const [url, setUrl] = useState('');
  const [googleAddress, setGoogleAddress] = useState(null);
  const [googleDetail, setGoogleDetail] = useState(null);
  const [name, setName] = useState(null);
  const [isCoverage, setIsCoverage] = useState(addressStatus.searching);
  const [notifyCoverage, setNotifyCoverage] = useState(true);
  const [buildType, setBuildType] = useState(locationType.house);
  const [addressDetail, setAddressDetail] = useState('');
  const [notesAddress, setNotesAddress] = useState('');
  const [currentLocationActive, setCurrentLocationActive] = useState(false);
  const [coordinate, setCoordinate] = useState({
    latitude: 6.2458077,
    longitude: -75.5680703,
  });
  useEffect(() => {
    getCoverage('Medellín', utilDispatch);
  }, [utilDispatch]);

  const checkCoverage = (latitude, longitude) => {
    let coverage = validateCoverage(latitude, longitude, coverageZones);

    setIsCoverage(coverage ? addressStatus.coverage : addressStatus.noCoverage);
  };

  const saveAddress = async () => {
    if (notesAddress === '') {
      return Alert.alert(
        'Ups',
        'Lo sentimos la nota de entrega es obligatoria',
      );
    }
    let item = {
      type: buildType,
      name,
      administrative_area_level_1: googleDetail.administrative_area_level_1,
      administrative_area_level_2: googleDetail.administrative_area_level_2,
      neighborhood: googleDetail.neighborhood,
      country: googleDetail.country,
      addressDetail,
      notesAddress: notesAddress,
      locality: googleDetail.locality,
      coordinates: coordinate,
      formattedAddress: googleAddress,
      id: Utilities.create_UUID(),
      url,
    };

    let address = [...user.address, item];

    await updateProfile(address, 'address', authDispatch);
    setIsCoverage(addressStatus.searching);
    setNotesAddress('');
    setAddAddress(false);
  };

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
  const closeModalCoverage = (data) => {
    if (!data) {
      setIsCoverage(addressStatus.searching);
    } else {
      setIsCoverage(addressStatus.searching);
    }
  };

  const activeApi = async (coordinates) => {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coordinates.latitude},${coordinates.longitude}&key=${APIKEY}`,
    );

    setUrl(res.url);
    const json = await res.json();
    if (json.status !== 'OK') {
      throw new Error(`Geocode error: ${json.status}`);
    } else {
      filterResultsByTypes(json.results, [
        'locality',
        'neighborhood',
        'political',
        'administrative_area_level_3',
        'administrative_area_level_2',
        'administrative_area_level_1',
      ]);
    }
  };

  const filterResultsByTypes = (unfilteredResults, types) => {
    const results = [];
    for (let i = 0; i < unfilteredResults.length; i++) {
      let found = false;

      for (let j = 0; j < types.length; j++) {
        if (unfilteredResults[i].types.indexOf(types[j]) !== -1) {
          found = true;
          break;
        }
      }

      if (found === true) {
        results.push(unfilteredResults[i]);
      }
    }

    let data = {};
    if (results.length > 0) {
      for (
        let index = 0;
        index < results[0].address_components.length;
        index++
      ) {
        let doc = results[0].address_components[index];
        let key = doc.types[0];
        let value = doc.long_name;
        let item = {[key]: value};

        data = {...data, ...item};
      }
    }

    setGoogleDetail(data);
  };
  return (
    <>
      <View
        style={{
          zIndex: 6,
          position: 'absolute',
          top: Metrics.screenHeight / 4,
          alignSelf: 'flex-end',
          right: 25,
        }}>
        <ButtonCoordinates
          activeApi={activeApi}
          setName={setName}
          setCoordinate={setCoordinate}
          APIKEY={APIKEY}
          checkCoverage={checkCoverage}
          setGoogleDetail={setGoogleDetail}
          setGoogleAddress={setGoogleAddress}
          setCurrentLocationActive={setCurrentLocationActive}
        />
      </View>
      <View
        style={{
          position: 'absolute',
          width: Metrics.screenWidth - 40,
          top: Metrics.screenHeight / 4,
          zIndex: 5,
          justifyContent: 'space-between',
          alignSelf: 'center',
          flexDirection: 'row-reverse',
        }}>
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
          filterReverseGeocodingByTypes={[
            'locality',
            'administrative_area_level_3',
          ]}
          // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
          debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
        />
      </View>

      <View style={{maxHeight: Metrics.screenHeight - 60}}>
        <View opacity={0.0} style={ApplicationStyles.separatorLineMini} />

        <Image
          source={Images.pinAddress}
          style={{
            width: 50,
            height: 50,
            resizeMode: 'contain',
            alignSelf: 'center',
            marginBottom: 10,
            tintColor: Colors.client.primaryColor,
          }}
        />
        <Text style={Fonts.style.bold(Colors.dark, Fonts.size.h6, 'center')}>
          {'Agregar direccion'}
        </Text>

        <Text
          style={Fonts.style.light(Colors.data, Fonts.size.small, 'center')}>
          {'Agrega y administra tus direcciones de servicio'}
        </Text>
        <View opacity={0.0} style={ApplicationStyles.separatorLineMini} />
        <MapView
          provider={__DEV__ ? null : PROVIDER_GOOGLE} // remove if not using Google Maps
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
        open={isCoverage === addressStatus.noCoverage}
        setOpen={closeModalCoverage}>
        <NoEnableCoverage
          notifyCoverage={notifyCoverage}
          setIsCoverage={setIsCoverage}
          setNotifyCoverage={setNotifyCoverage}
          setGoogleAddress={setGoogleAddress}
        />
      </ModalApp>
      <ModalApp // true coverage
        open={isCoverage === addressStatus.coverage}
        setOpen={closeModalCoverage}>
        <EnableCoverage
          googleDetail={googleDetail}
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
          currentLocationActive={currentLocationActive}
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

  descriptorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  selectorText: {
    marginHorizontal: 20,
    fontWeight: 'bold',
    color: Colors.dark,
    fontSize: Fonts.size.medium,
    textAlignVertical: 'center',
    textAlign: 'center',
  },
  btnText: {
    fontWeight: 'bold',
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
