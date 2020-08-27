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

import Modal from 'react-native-modal';
import MyTextInput from '../../components/MyTextInput';
import {validateCoverage} from '../../helpers/GeoHelper';

import Utilities from '../../utilities';
import {updateProfile} from '../../flux/auth/actions';
import {StoreContext} from '../../flux';

const AddAddress = () => {
  const {state /* authDispatch */} = useContext(StoreContext);
  const {auth} = state;
  const {user} = auth;

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

    setIsCoverage({
      isCoverage: coverage ? addresStatus.coverage : addresStatus.noCoverage,
    });
  };

  const saveAddress = async (props) => {
    const {closeAddAddress} = props;

    const address_components = googleAddress.address_components;
    let components = {};
    address_components.map((value, index) => {
      value.types.map((value2, index2) => {
        components[value2] = value.long_name;
        if (value2 === 'country') {
          components.country_id = value.short_name;
        }
        if (value2 === 'administrative_area_level_1') {
          components.state_code = value.short_name;
        }
      });
    });

    console.log('components', components);

    let item = {
      type: buildType,
      name: googleAddress.name,
      addressDetail: addressDetail,
      notesAddress: notesAddress,
      coordinates: {
        latitude: googleAddress.geometry.location.lat,
        longitude: googleAddress.geometry.location.lng,
      },
      formattedAddress: googleAddress.formatted_address,
      idAddress: googleAddress.id,
      id: Utilities.create_UUID(),
      vicinity: googleAddress.vicinity,
      url: googleAddress.url,
      ...components,
    };
    let address = [...user.address, item];

    console.log('address', address);

    await updateProfile(address, 'address');

    setIsCoverage(addresStatus.searching);
    closeAddAddress();
  };
  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.containerAddress}>
          <GooglePlacesAutocomplete
            placeholder={'Escribe tu direccion (ej: carrera 33 #10-20)'}
            minLength={4} // minimum length of text to search
            autoFocus={false}
            returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
            keyboardAppearance={'light'} // Can be left out for default keyboardAppearance https://facebook.github.io/react-native/docs/textinput.html#keyboardappearance
            listViewDisplayed={false} // true/false/undefined
            fetchDetails={true}
            renderDescription={(row) => row.description} // custom description render
            onPress={(data, details = null) => {
              console.log(data, details);

              let userCoordinate = {
                latitude: details.geometry.location.lat,
                longitude: details.geometry.location.lng,
              };

              setGoogleAddress(details);
              setCoordinate(userCoordinate);
            }}
            getDefaultValue={() => ''}
            query={{
              // available options: https://developers.google.com/places/web-service/autocomplete
              key: 'AIzaSyBX9OXlxkA18EWnRrg6bzgWuQkHbTVx1aI',
              language: 'es', // language of the results
              types: 'geocode', // default: 'geocode'
              components: 'country:co',
              location: '6.2690007,-75.734792',
              radius: '55000', //15 km
              strictbounds: true,
            }}
            styles={{
              textInputContainer: {
                width: '100%',
                height: 55,
                borderTopWidth: 0,
                borderBottomWidth: 0,
                backgroundColor: Colors.light,
              },
              poweredContainer: {
                height: 30,
                borderBottomLeftRadius: Metrics.borderRadius,
                borderBottomRightRadius: Metrics.borderRadius,
              },
              powered: {width: 100, height: 50},
              textInput: {
                height: 40,
                backgroundColor: Colors.textInputBg,
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
          />
        </View>
        <View
          style={{
            width: Metrics.screenWidth,
            flex: 1,
          }}>
          <View
            style={{
              flex: 1,
              marginBottom: 60 + Metrics.addFooter - 10,
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}>
            <MapView
              provider={PROVIDER_GOOGLE} // remove if not using Google Maps
              style={{
                ...StyleSheet.absoluteFillObject,
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
        </View>
        <TouchableOpacity
          disabled={!googleAddress}
          onPress={() =>
            checkCoverage(
              googleAddress.geometry.location.lat,
              googleAddress.geometry.location.lng,
            )
          }
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
        </TouchableOpacity>
      </View>

      <Modal // noCoverage
        isVisible={isCoverage === addresStatus.noCoverage}
        style={{}}
        animationIn={'slideInRight'}
        animationOut={'slideOutRight'}
        backdropColor={Colors.pinkMask(0.8)}
        onBackdropPress={() => setIsCoverage(addresStatus.searching)}>
        <View
          style={{
            alignSelf: 'center',
            width: Metrics.screenWidth * 0.6,
            backgroundColor: Colors.light,
            backdropColor: 'red',
            borderRadius: 10,
          }}>
          <View
            style={{
              alignSelf: 'center',
              width: Metrics.screenWidth * 0.6,
              backgroundColor: Colors.light,
              backdropColor: 'red',
              borderRadius: 10,
            }}>
            <Text
              style={[
                Fonts.style.bold(Colors.dark, Fonts.size.h6, 'center'),
                {marginVertical: 10},
              ]}>
              {'Lo Sentimos'}
            </Text>
            <Text
              style={Fonts.style.regular(
                Colors.dark,
                Fonts.size.medium,
                'center',
              )}>
              {'La dirección ingresada no tiene cobertura.'}
            </Text>

            <View
              style={{
                width: '90%',
                alignSelf: 'center',
                marginVertical: 5,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <TouchableOpacity
                onPress={() => setNotifyCoverage(!notifyCoverage)}>
                {notifyCoverage ? (
                  <Icon
                    name={'toggle-on'}
                    size={25}
                    color={Colors.client.primaryColor}
                  />
                ) : (
                  <Icon name={'toggle-off'} size={25} color={Colors.gray} />
                )}
              </TouchableOpacity>
              <View
                style={{
                  flex: 1,

                  marginHorizontal: 5,
                }}>
                <Text
                  style={Fonts.style.regular(
                    Colors.dark,
                    Fonts.size.small,
                    'left',
                    0,
                  )}>
                  Notificarme cuando tenga cobertura
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => {
              setIsCoverage(false);
            }}
            style={{
              alignSelf: 'center',
              width: '100%',
              paddingVertical: 10,
              marginTop: 10,
              backgroundColor: Colors.client.primaryColor,
              borderBottomLeftRadius: 10,
              borderBottomRightRadius: 10,
            }}>
            <Text
              style={Fonts.style.bold(
                Colors.light,
                Fonts.size.medium,
                'center',
              )}>
              {'Continuar'}
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal // coverage
        isVisible={isCoverage === addresStatus.coverage}
        style={{}}
        animationIn={'slideInRight'}
        animationOut={'slideOutRight'}
        backdropColor={Colors.pinkMask(0.8)}
        onBackdropPress={() => setIsCoverage(addresStatus.searching)}>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <View
            style={{
              alignSelf: 'center',
              position: 'absolute',
              width: Metrics.screenWidth * 0.8,
              backgroundColor: Colors.light,
              backdropColor: 'red',
              borderRadius: 10,
            }}>
            <View
              style={{
                alignSelf: 'center',
                width: Metrics.screenWidth * 0.8,
                backgroundColor: Colors.light,
                backdropColor: 'red',
                borderRadius: 10,
              }}>
              <Text
                style={[
                  Fonts.style.bold(Colors.dark, Fonts.size.h6, 'center'),
                  {marginVertical: 10},
                ]}>
                {'Completa tu direccón'}
              </Text>
              <MapView
                provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                style={{
                  width: Metrics.screenWidth * 0.8,
                  height: Metrics.screenWidth * 0.4,
                }}
                customMapStyle={mapStyle}
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
              <Text
                style={[
                  Fonts.style.regular(Colors.dark, Fonts.size.medium, 'center'),
                  {marginVertical: 10},
                ]}>
                <Icon
                  name={'map-marker-alt'}
                  size={15}
                  color={Colors.client.primaryColor}
                />
                {googleAddress && googleAddress.formatted_address
                  ? googleAddress.formatted_address
                  : ''}
              </Text>

              <View style={styles.itemAddressContainer}>
                <TouchableOpacity
                  onPress={() => setBuildType(0)}
                  style={[
                    styles.itemAddress,
                    {
                      backgroundColor:
                        buildType === 0
                          ? Colors.client.primaryColor
                          : Colors.gray,
                    },
                  ]}>
                  <Text
                    style={[
                      Fonts.style.bold(
                        Colors.snow,
                        Fonts.size.medium,
                        'center',
                      ),
                      {marginVertical: 5},
                    ]}>
                    CASA
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setBuildType(1)}
                  style={[
                    styles.itemAddress,
                    {
                      backgroundColor:
                        buildType === 1
                          ? Colors.client.primaryColor
                          : Colors.gray,
                    },
                  ]}>
                  <Text
                    style={[
                      Fonts.style.bold(
                        Colors.snow,
                        Fonts.size.medium,
                        'center',
                      ),
                      {marginVertical: 5},
                    ]}>
                    OFICINA
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setBuildType(2)}
                  style={[
                    styles.itemAddress,
                    {
                      backgroundColor:
                        buildType === 2
                          ? Colors.client.primaryColor
                          : Colors.gray,
                    },
                  ]}>
                  <Text
                    style={[
                      Fonts.style.bold(
                        Colors.snow,
                        Fonts.size.medium,
                        'center',
                      ),
                      {marginVertical: 5},
                    ]}>
                    HOTEL
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setBuildType(3)}
                  style={[
                    styles.itemAddress,
                    {
                      backgroundColor:
                        buildType === 3
                          ? Colors.client.primaryColor
                          : Colors.gray,
                    },
                  ]}>
                  <Text
                    style={[
                      Fonts.style.bold(
                        Colors.snow,
                        Fonts.size.medium,
                        'center',
                      ),
                      {marginVertical: 5},
                    ]}>
                    OTRO
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View
              style={{width: '90%', alignSelf: 'center', marginVertical: 10}}>
              <Text
                style={[
                  Fonts.style.bold(Colors.dark, Fonts.size.small, 'left'),
                  {marginVertical: 5},
                ]}>
                Complementos
              </Text>
              <MyTextInput
                pHolder={'bloque/Apartamento/habitación/Piso'}
                text={addressDetail}
                multiLine={false}
                onChangeText={(text) => setAddressDetail(text)}
                secureText={false}
                textContent={'emailAddress'}
                autoCapitalize={'none'}
              />
            </View>

            <View
              style={{width: '90%', alignSelf: 'center', marginVertical: 10}}>
              <Text
                style={[
                  Fonts.style.bold(Colors.dark, Fonts.size.small, 'left'),
                  {marginVertical: 5},
                ]}>
                Detalles complementarios
              </Text>
              <MyTextInput
                pHolder={
                  'Puntos de referencia, indicaciones especiales u otros'
                }
                text={notesAddress}
                multiLine={true}
                onChangeText={(text) => setNotesAddress(text)}
                secureText={false}
                textContent={'none'}
                autoCapitalize={'none'}
              />
            </View>

            <TouchableOpacity
              onPress={() => saveAddress()}
              style={{
                alignSelf: 'center',
                width: '100%',
                paddingVertical: 10,
                backgroundColor: Colors.client.primaryColor,
                borderBottomLeftRadius: 10,
                borderBottomRightRadius: 10,
              }}>
              <Text
                style={Fonts.style.bold(
                  Colors.light,
                  Fonts.size.medium,
                  'center',
                )}>
                {'Guardar'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
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
