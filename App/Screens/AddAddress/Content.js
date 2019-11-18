import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  Alert,
  Platform,
  StyleSheet,
  Dimensions,
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
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import Loading from '../../Components/Loading';

import {validateCoverage} from '../../Helpers/GeoHelper';
import MapView, {
  PROVIDER_GOOGLE,
  Marker,
  AnimatedRegion,
} from 'react-native-maps';
import Utilities from '../../Utilities';

const screen = Dimensions.get('window');
const ASPECT_RATIO = screen.width * 0.8 - 500 / screen.height;
const LATITUDE_DELTA = 0.0003;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const mapStyle = require('../../Config/mapStyle.json');

var addresStatus = {
  searching: 0,
  coverage: 1,
  noCoverage: 2,
};

var locationType = {
  house: 0,
  office: 1,
  hotel: 2,
  otro: 3,
};

var petsType = {
  nothing: 0,
  dogs: 1,
  cats: 2,
  both: 3,
};

export default class Address extends Component {
  constructor(props) {
    super(props);
    this.state = {
      googleAddress: null,
      isCoverage: addresStatus.searching,
      notifyCoverage: true,
      buildType: locationType.house,
      pets: petsType.nothing,
      addressDetail: '',
      notesAddress: '',
      coordinate: new AnimatedRegion({
        latitude: 6.2458077,
        longitude: -75.5680703,
      }),
    };
  }

  async componentDidMount() {}

  async saveAddress() {
    const {user, updateProfile, setLoading} = this.props;
    const {
      buildType,
      googleAddress,
      addressDetail,
      notesAddress,
      pets,
    } = this.state;

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
      pets: pets,
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

    setLoading(true);
    await updateProfile(address, 'address');

    setLoading(false);
    this.setState({isCoverage: addresStatus.searching}, () => {
      this.props.closeAddAddress();
    });
  }

  checkCoverage(latitude, longitude) {
    const {coverageZones} = this.props;

    let coverage = validateCoverage(latitude, longitude, coverageZones);

    this.setState(
      {isCoverage: coverage ? addresStatus.coverage : addresStatus.noCoverage},
      () => {
        console.log('isCoverage', this.state.isCoverage);
      },
    );
  }

  render() {
    const {loading} = this.props;
    const {
      googleAddress,
      isCoverage,
      buildType,
      addressDetail,
      notifyCoverage,
      pets,
      notesAddress,
    } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <View style={styles.headerContainer}>
            <Text
              style={Fonts.style.bold(Colors.dark, Fonts.size.h6, 'center')}>
              {'Agregar Nueva direccion'}
            </Text>
            <View opacity={0.0} style={ApplicationStyles.separatorLine} />
            {__DEV__ && (
              <View
                style={{
                  position: 'absolute',
                  zIndex: 1000,
                  top: 0,
                  left: 0,
                  flexDirection: 'row',
                  backgroundColor: 'yellow',
                }}>
                <TouchableOpacity
                  onPress={() => {
                    this.googlePlacesAutocomplete._handleChangeText(
                      'carrera 39 #8-14',
                    );
                  }}
                  style={{
                    width: 20,
                    height: 10,
                    backgroundColor: 'green',
                  }}
                />
                <TouchableOpacity
                  onPress={() => {
                    this.googlePlacesAutocomplete._handleChangeText(
                      'calle 100 #8-14',
                    );
                  }}
                  style={{
                    width: 20,
                    height: 10,
                    backgroundColor: 'red',
                  }}
                />
              </View>
            )}
          </View>

          <View style={styles.containerAddress}>
            <GooglePlacesAutocomplete
              ref={c => (this.googlePlacesAutocomplete = c)}
              placeholder={'Escribe tu direccion (ej: carrera 33 #10-20)'}
              minLength={4} // minimum length of text to search
              autoFocus={false}
              returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
              keyboardAppearance={'light'} // Can be left out for default keyboardAppearance https://facebook.github.io/react-native/docs/textinput.html#keyboardappearance
              listViewDisplayed={false} // true/false/undefined
              fetchDetails={true}
              renderDescription={row => row.description} // custom description render
              onPress={(data, details = null) => {
                // 'details' is provided when fetchDetails = true
                console.log(data, details);

                let userCoordinate = {
                  latitude: details.geometry.location.lat,
                  longitude: details.geometry.location.lng,
                };

                console.log('userCoordinate', userCoordinate);
                this.setState(
                  {
                    googleAddress: details,
                    coordinate: userCoordinate,
                  },
                  () => {
                    console.log('googleAddress', this.state.googleAddress);
                  },
                );
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
              // renderLeftButton={() => (
              //   <View
              //     style={{
              //       marginHorizontal: 10,
              //       justifyContent: 'center',
              //     }}>
              //     <Icon
              //       name={'map-marker-alt'}
              //       size={25}
              //       color={Colors.client.primartColor}
              //     />
              //   </View>
              // )}
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
                  latitude: this.state.coordinate.latitude,
                  longitude: this.state.coordinate.longitude,
                  latitudeDelta: 0.00001,
                  longitudeDelta: 0.00001 * ASPECT_RATIO,
                }}>
                <Marker.Animated
                  coordinate={{
                    latitude: this.state.coordinate.latitude,
                    longitude: this.state.coordinate.longitude,
                  }}
                  // identifier={`coordinate_${index}`}
                  // heading={coordinate.heading ? coordinate.heading : 0}
                >
                  <Icon
                    name={'map-marker-alt'}
                    size={30}
                    color={Colors.client.primartColor}
                  />
                </Marker.Animated>
              </MapView>
            </View>
          </View>
          <TouchableOpacity
            disabled={!googleAddress}
            onPress={() => {
              this.checkCoverage(
                this.state.googleAddress.geometry.location.lat,
                this.state.googleAddress.geometry.location.lng,
              );
            }}
            style={[
              styles.btnContainer,
              {
                position: 'absolute',
                bottom: 0,
                backgroundColor: googleAddress
                  ? Colors.client.primartColor
                  : Colors.gray,
              },
            ]}>
            <Text
              style={Fonts.style.bold(
                Colors.light,
                Fonts.size.medium,
                'center',
              )}>
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
          onBackdropPress={() => {
            this.setState({isCoverage: addresStatus.searching});
          }}>
          <View
            style={{
              // paddingTop: Metrics.addHeader,
              alignSelf: 'center',
              width: Metrics.screenWidth * 0.6,
              backgroundColor: Colors.light,
              backdropColor: 'red',
              borderRadius: 10,
            }}>
            <View
              style={{
                // paddingTop: Metrics.addHeader,
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
                  onPress={() => {
                    this.setState({notifyCoverage: !notifyCoverage});
                  }}>
                  {notifyCoverage ? (
                    <Icon
                      name={'toggle-on'}
                      size={25}
                      color={Colors.client.primartColor}
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
                this.googlePlacesAutocomplete._handleChangeText('');
                this.setState({isCoverage: false});
              }}
              style={{
                alignSelf: 'center',
                width: '100%',
                paddingVertical: 10,
                marginTop: 10,
                backgroundColor: Colors.client.primartColor,
                borderBottomLeftRadius: 10,
                borderBottomRightRadius: 10,
                // borderRadius: 10,
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

            <Loading type={'client'} loading={loading} />
          </View>
        </Modal>

        <Modal // coverage
          isVisible={isCoverage === addresStatus.coverage}
          style={{}}
          animationIn={'slideInRight'}
          animationOut={'slideOutRight'}
          backdropColor={Colors.pinkMask(0.8)}
          onBackdropPress={() => {
            this.setState({isCoverage: addresStatus.searching});
          }}>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <View
              style={{
                // paddingTop: Metrics.addHeader,
                alignSelf: 'center',
                position: 'absolute',
                width: Metrics.screenWidth * 0.8,
                backgroundColor: Colors.light,
                backdropColor: 'red',
                borderRadius: 10,
              }}>
              <View
                style={{
                  // paddingTop: Metrics.addHeader,
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
                    latitude: this.state.coordinate.latitude,
                    longitude: this.state.coordinate.longitude,
                    latitudeDelta: 0.00001,
                    longitudeDelta: 0.00001 * ASPECT_RATIO,
                  }}>
                  <Marker.Animated
                    coordinate={{
                      latitude: this.state.coordinate.latitude,
                      longitude: this.state.coordinate.longitude,
                    }}
                    // identifier={`coordinate_${index}`}
                    // heading={coordinate.heading ? coordinate.heading : 0}
                  >
                    <Icon
                      name={'map-marker-alt'}
                      size={30}
                      color={Colors.client.primartColor}
                    />
                  </Marker.Animated>
                </MapView>
                <Text
                  style={[
                    Fonts.style.regular(
                      Colors.dark,
                      Fonts.size.medium,
                      'center',
                    ),
                    {marginVertical: 10},
                  ]}>
                  <Icon
                    name={'map-marker-alt'}
                    size={15}
                    color={Colors.client.primartColor}
                  />{' '}
                  {this.state.googleAddress &&
                  this.state.googleAddress.formatted_address
                    ? this.state.googleAddress.formatted_address
                    : ''}
                </Text>

                <View style={styles.itemAddressContainer}>
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({buildType: 0});
                    }}
                    style={[
                      styles.itemAddress,
                      {
                        backgroundColor:
                          buildType === 0
                            ? Colors.client.primartColor
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
                    onPress={() => {
                      this.setState({buildType: 1});
                    }}
                    style={[
                      styles.itemAddress,
                      {
                        backgroundColor:
                          buildType === 1
                            ? Colors.client.primartColor
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
                    onPress={() => {
                      this.setState({buildType: 2});
                    }}
                    style={[
                      styles.itemAddress,
                      {
                        backgroundColor:
                          buildType === 2
                            ? Colors.client.primartColor
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
                    onPress={() => {
                      this.setState({buildType: 3});
                    }}
                    style={[
                      styles.itemAddress,
                      {
                        backgroundColor:
                          buildType === 3
                            ? Colors.client.primartColor
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
                  onChangeText={text => this.setState({addressDetail: text})}
                  secureText={false}
                  textContent={'emailAddress'}
                  autoCapitalize={'none'}
                />

                <Text
                  style={[
                    Fonts.style.bold(Colors.dark, Fonts.size.small, 'left'),
                    {marginVertical: 5},
                  ]}>
                  Mascotas
                </Text>
              </View>

              <View style={styles.itemAddressContainer}>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({pets: 0});
                  }}
                  style={[
                    styles.itemAddress,
                    {
                      backgroundColor:
                        pets === 0 ? Colors.client.primartColor : Colors.gray,
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
                    NINGUN0
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({pets: 1});
                  }}
                  style={[
                    styles.itemAddress,
                    {
                      backgroundColor:
                        pets === 1 ? Colors.client.primartColor : Colors.gray,
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
                    PERROS
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({pets: 2});
                  }}
                  style={[
                    styles.itemAddress,
                    {
                      backgroundColor:
                        pets === 2 ? Colors.client.primartColor : Colors.gray,
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
                    GATOS
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({pets: 3});
                  }}
                  style={[
                    styles.itemAddress,
                    {
                      backgroundColor:
                        pets === 3 ? Colors.client.primartColor : Colors.gray,
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
                    AMBOS
                  </Text>
                </TouchableOpacity>
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
                  onChangeText={text => this.setState({notesAddress: text})}
                  secureText={false}
                  textContent={'none'}
                  autoCapitalize={'none'}
                />
              </View>

              <TouchableOpacity
                onPress={() => {
                  this.saveAddress();
                }}
                style={{
                  alignSelf: 'center',
                  width: '100%',
                  paddingVertical: 10,
                  // marginTop: 10,
                  backgroundColor: Colors.client.primartColor,
                  borderBottomLeftRadius: 10,
                  borderBottomRightRadius: 10,
                  // borderRadius: 10,
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
            <Loading type={'client'} loading={loading} />
          </View>
        </Modal>
      </View>
    );
  }
}
