import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Keyboard,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import {getDistance} from '../../GeoHelper';
import {Colors, Images, Fonts} from '../../Themes';
import Geolocation from '@react-native-community/geolocation';
import MyTextInput from '../../Components/MyTextInput';

import styles from './styles';

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userLocation: '',
      showFinder: false,
      lat: '',
      long: '',
    };
  }

  async callLocations(lat, long) {
    const {getPlaces, setLoading} = this.props;
    setLoading(true);
    await getPlaces(lat, long);
    setLoading(false);
  }

  async callGetCities(str) {
    const {setLoading, getCities, cities} = this.props;

    setLoading(true);
    await getCities(str);
    setLoading(false);
  }

  getLocationUser() {
    Geolocation.getCurrentPosition(info => {
      const {coords} = info;
      const {latitude, longitude} = coords;
      this.setState({
        userLocation: 'My Location',
        lat: latitude,
        long: longitude,
      });
      this.callLocations(latitude, longitude);
    });
  }
  render() {
    const {loading, cities, places} = this.props;
    const {userLocation, showFinder, lat, long} = this.state;
    return (
      <LinearGradient
        style={styles.container}
        colors={Colors.backgroundGradient}
        start={{x: 0, y: 0.0}}
        end={{x: 0, y: 1.0}}>
        <KeyboardAvoidingView
          // style={{position: 'absolute', flex: 1}}
          behavior="padding"
          enabled>
          <View style={styles.headerContainer}>
            <Text style={Fonts.style.bold(Colors.light, Fonts.size.h4, 'left')}>
              {'Discover Restaurants\nin your City'}
            </Text>
            <View style={styles.locationContainer}>
              <MyTextInput
                pHolder={'New York, New Yersey, Los Angeles, etc...'}
                text={userLocation}
                onChangeText={text => this.setState({userLocation: text})}
                secureText={false}
                textContent={'name'}
                autoCapitalize={'words'}
              />
              <TouchableOpacity
                style={styles.iconLocation}
                onPress={() => {
                  if (userLocation === '') {
                    this.getLocationUser();
                  } else {
                    this.callGetCities(userLocation);
                    this.setState({showFinder: true});
                    Keyboard.dismiss();
                  }
                }}>
                <Image
                  source={
                    userLocation === ''
                      ? Images.navigation
                      : Images.magnifyingGlass
                  }
                  style={styles.navigationIcon}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.containerCities}>
              <View style={styles.containerCity}>
                {showFinder &&
                  cities.length > 0 &&
                  cities.map(item => {
                    return (
                      <TouchableOpacity
                        onPress={() => {
                          this.callLocations(item.latitude, item.longitude);
                          this.setState({
                            userLocation: item.city_name,
                            showFinder: false,
                          });
                        }}
                        key={item.entity_id}
                        style={styles.itemCity}>
                        <Text
                          style={Fonts.style.bold(
                            Colors.dark,
                            Fonts.size.small,
                            'left',
                          )}>
                          {item.city_name} - {item.country_name}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
              </View>
            </View>
            <Text
              style={Fonts.style.regular(
                Colors.light,
                Fonts.size.small,
                'left',
              )}>
              {'Enter the name of a city or active your current location'}
            </Text>
          </View>
          <ScrollView style={styles.scrollView}>
            {showFinder === false &&
              places.length > 0 &&
              places.map((item, index) => {
                const {restaurant} = item;

                return (
                  <TouchableOpacity
                    onPress={() => {}}
                    key={restaurant.id}
                    style={styles.itemResto}>
                    {restaurant.thumb !== '' && (
                      <Image
                        style={styles.imageResto}
                        source={{
                          uri: restaurant.thumb,
                        }}
                      />
                    )}
                    <View style={styles.textContainerResto}>
                      <Text
                        style={Fonts.style.regular(
                          Colors.dark,
                          Fonts.size.small,
                          'left',
                        )}>
                        Name:{' '}
                        <Text
                          style={Fonts.style.bold(
                            Colors.dark,
                            Fonts.size.small,
                            'left',
                          )}>
                          {restaurant.name}
                        </Text>
                      </Text>
                      <Text
                        style={Fonts.style.regular(
                          Colors.dark,
                          Fonts.size.small,
                          'left',
                        )}>
                        Cousine:{' '}
                        <Text
                          style={Fonts.style.bold(
                            Colors.dark,
                            Fonts.size.small,
                            'left',
                          )}>
                          {restaurant.cuisines}
                        </Text>
                      </Text>
                      <Text
                        style={Fonts.style.regular(
                          Colors.dark,
                          Fonts.size.small,
                          'left',
                        )}>
                        Location:{' '}
                        <Text
                          style={Fonts.style.bold(
                            Colors.dark,
                            Fonts.size.small,
                            'left',
                          )}>
                          {restaurant.location.address}{' '}
                          {restaurant.location.city}
                        </Text>
                      </Text>
                      <Text
                        style={Fonts.style.regular(
                          Colors.dark,
                          Fonts.size.small,
                          'left',
                        )}>
                        {'\n'}Distance:{' '}
                        <Text
                          style={Fonts.style.bold(
                            Colors.dark,
                            Fonts.size.small,
                            'left',
                          )}>
                          {getDistance(
                            {latitude: lat, longitude: long},
                            {
                              latitude: restaurant.location.latitude,
                              longitude: restaurant.location.longitude,
                            },
                          )}
                        </Text>
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
          </ScrollView>
        </KeyboardAvoidingView>

        {loading && <View style={styles.loading} />}
      </LinearGradient>
    );
  }
}
