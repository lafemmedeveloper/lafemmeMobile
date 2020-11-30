import React, {useState, useContext, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {ApplicationStyles, Colors, Fonts, Images, Metrics} from '../../themes';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import Icon from 'react-native-vector-icons/FontAwesome5';

import {filterResultsByTypes, validateCoverage} from '../../helpers/GeoHelper';

import Utilities from '../../utilities';
import {updateProfile} from '../../flux/auth/actions';
import {StoreContext} from '../../flux';
import ModalApp from '../../components/ModalApp';
import EnableCoverage from './EnableCoverage';
import NoEnableCoverage from './NoEnableCoverage';
import {getCoverage} from '../../flux/util/actions';
//import ButtonCoordinates from '../../components/ButtonCoordinates';
import Config from 'react-native-config';

const AddAddress = ({setAddAddress}) => {
  //  const APIKEY = 'AIzaSyArVhfk_wHVACPwunlCi1VP9EUgYZcnFpQ';
  const APIKEY = Config.GOOGLE_APIKEY;
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
  const [googleAddress, setGoogleAddress] = useState(null);
  const [googleDetail, setGoogleDetail] = useState(null);
  const [name, setName] = useState(null);
  const [isCoverage, setIsCoverage] = useState(addressStatus.searching);
  const [notifyCoverage, setNotifyCoverage] = useState(true);
  const [buildType, setBuildType] = useState(locationType.house);
  const [addressDetail, setAddressDetail] = useState('');
  const [notesAddress, setNotesAddress] = useState('');
  const [
    currentLocationActive, // setCurrentLocationActive
  ] = useState(false);
  const [coverageNotification, setCoverageNotification] = useState([]);
  const [coordinate, setCoordinate] = useState({
    latitude: 6.2458077,
    longitude: -75.5680703,
  });
  useEffect(() => {
    getCoverage('Medellín', utilDispatch);
  }, [utilDispatch]);

  const checkCoverage = (latitude, longitude) => {
    let result = validateCoverage(latitude, longitude, coverageZones);
    setCoverageNotification(result.name);
    setIsCoverage(
      result.isCoverage ? addressStatus.coverage : addressStatus.noCoverage,
    );
  };

  const saveAddress = async () => {
    if (notesAddress === '') {
      return Alert.alert(
        'Ups',
        'Lo sentimos la nota de servicio es obligatoria',
      );
    }
    let item = {
      type: buildType,
      name,
      administrative_area_level_1: googleDetail.administrative_area_level_1,
      administrative_area_level_2: googleDetail.administrative_area_level_2,
      neighborhood: googleDetail.neighborhood,
      country: googleDetail.country,
      locality: googleDetail.locality,
      notesAddress: notesAddress,
      addressDetail,
      coordinates: coordinate,
      formattedAddress: googleAddress,
      id: Utilities.create_UUID(),
      coverageNotification,
    };

    let address = [...user.address, item];

    await updateProfile(address, 'address', authDispatch);
    setIsCoverage(addressStatus.searching);
    setNotesAddress('');
    setAddAddress(false);
  };

  const closeModalCoverage = (data) => {
    if (!data) {
      setIsCoverage(addressStatus.searching);
    } else {
      setIsCoverage(addressStatus.searching);
    }
  };

  const handleAddress = async (data, details) => {
    const result = await filterResultsByTypes(details.address_components);

    setName(data.description);
    setGoogleAddress(data.description);
    setGoogleDetail({
      ...result,
    });
    setCoordinate({
      latitude: details.geometry.location.lat,
      longitude: details.geometry.location.lng,
    });
  };
  console.log('Metrics.screenHeight ', Metrics.header);
  return (
    <>
      {/*
           <View
        style={{
          zIndex: 5,
          position: 'absolute',
          bottom: 90,
          alignSelf: 'flex-end',
          right: 20,
        }}>
         <ButtonCoordinates
          setName={setName}
          setCoordinate={setCoordinate}
          APIKEY={APIKEY}
          checkCoverage={checkCoverage}
          setGoogleAddress={setGoogleAddress}
          setCurrentLocationActive={setCurrentLocationActive}
          setGoogleDetail={setGoogleDetail}
        />
         </View>
      */}

      <KeyboardAvoidingView
        behavior={Platform.OS !== 'ios' && 'height'}
        keyboardVerticalOffset={-55}
        style={{maxHeight: Metrics.screenHeight - 60}}>
        <View
          style={{
            width: Metrics.screenWidth,
            height: Metrics.screenHeight * 0.8,

            flexDirection: 'column',
          }}>
          <View opacity={0.0} style={ApplicationStyles.separatorLineMini} />
          <View
            style={{
              paddingVertical: 10,
              flex: 0,
            }}>
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
            <Text
              style={Fonts.style.bold(Colors.dark, Fonts.size.h6, 'center')}>
              {'Agregar dirección'}
            </Text>

            <Text
              style={Fonts.style.light(
                Colors.data,
                Fonts.size.small,
                'center',
              )}>
              {'Agrega y administra tus direcciones de servicio'}
            </Text>
          </View>

          <View
            style={{
              flex: 4,
            }}>
            <View
              style={{
                flex: 0,
                position: 'absolute',
                width: Metrics.screenWidth - 40,

                zIndex: 7,
                marginVertical: 10,
                justifyContent: 'space-between',
                alignSelf: 'center',
                flexDirection: 'row-reverse',
              }}>
              <GooglePlacesAutocomplete
                placeholder={'Ej: Ciudad, barrio, dirección, lugar...'}
                autoFocus={false}
                returnKeyType={'search'}
                keyboardAppearance={'light'}
                fetchDetails={true}
                renderDescription={(row) => row.description}
                onPress={(data, details) => {
                  handleAddress(data, details);
                }}
                getDefaultValue={() => ''}
                query={{
                  key: APIKEY,
                  language: 'es',
                  types: 'geocode',
                  components: 'country:co',
                  location: '6.2690007,-75.734792',
                  radius: '55000',
                  strictbounds: true,
                }}
                textInputProps={{
                  onChangeText: (text) => {
                    console.log('value input', text);
                  },
                }}
                onFail={(error) => console.log('AddressModal -> onFail', error)}
                onNotFound={(error) =>
                  console.log('AddressModal -> onNotFound', error)
                }
                nearbyPlacesAPI={'GooglePlacesSearch'}
                GooglePlacesDetailsQuery={{
                  fields: ['formatted_address', 'geometry', 'vicinity'],
                }}
                filterReverseGeocodingByTypes={[
                  'locality',
                  'administrative_area_level_3',
                ]}
                debounce={200}
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
              />
            </View>

            <MapView
              provider={PROVIDER_GOOGLE} // remove if not using Google Maps
              style={{
                width: Metrics.screenWidth,
                height: '100%',
              }}
              scrollEnabled={false}
              zoomEnabled={false}
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
        </View>

        {/* <View opacity={0.0} style={ApplicationStyles.separatorLineMini} /> */}
      </KeyboardAvoidingView>

      <TouchableOpacity
        disabled={!googleAddress}
        onPress={() => checkCoverage(coordinate.latitude, coordinate.longitude)}
        style={[
          styles.btnContainer,
          {
            // position: 'absolute',
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
