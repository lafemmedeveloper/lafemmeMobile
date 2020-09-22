import React from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import {Metrics, Colors, Fonts} from '../../../themes';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import Icon from 'react-native-vector-icons/FontAwesome5';

import MyTextInput from '../../../components/MyTextInput';

const EnableCoverage = (props) => {
  const {
    mapStyle,
    LATITUDE_DELTA,
    LONGITUDE_DELTA,
    ASPECT_RATIO,
    buildType,
    setAddressDetail,
    addressDetail,
    coordinate,
    setBuildType,
    saveAddress,
    googleAddress,
    notesAddress,
    setNotesAddress,
  } = props;
  return (
    <>
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
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
            {googleAddress}
          </Text>

          <View style={styles.itemAddressContainer}>
            <TouchableOpacity
              onPress={() => setBuildType(0)}
              style={[
                styles.itemAddress,
                {
                  backgroundColor:
                    buildType === 0 ? Colors.client.primaryColor : Colors.gray,
                },
              ]}>
              <Text
                style={[
                  Fonts.style.bold(Colors.snow, Fonts.size.medium, 'center'),
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
                    buildType === 1 ? Colors.client.primaryColor : Colors.gray,
                },
              ]}>
              <Text
                style={[
                  Fonts.style.bold(Colors.snow, Fonts.size.medium, 'center'),
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
                    buildType === 2 ? Colors.client.primaryColor : Colors.gray,
                },
              ]}>
              <Text
                style={[
                  Fonts.style.bold(Colors.snow, Fonts.size.medium, 'center'),
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
                    buildType === 3 ? Colors.client.primaryColor : Colors.gray,
                },
              ]}>
              <Text
                style={[
                  Fonts.style.bold(Colors.snow, Fonts.size.medium, 'center'),
                  {marginVertical: 5},
                ]}>
                OTRO
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{width: '90%', alignSelf: 'center', marginVertical: 10}}>
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

        <View style={{width: '90%', alignSelf: 'center', marginVertical: 10}}>
          <Text
            style={[
              Fonts.style.bold(Colors.dark, Fonts.size.small, 'left'),
              {marginVertical: 5},
            ]}>
            Detalles complementarios
          </Text>
          <MyTextInput
            pHolder={'Puntos de referencia, indicaciones especiales u otros'}
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
          style={[
            {
              flex: 0,
              borderRadius: Metrics.textInBr,
              alignSelf: 'center',
              flexDirection: 'row',
              justifyContent: 'center',
              width: '90%',

              paddingHorizontal: 10,
              paddingVertical: 10,
              backgroundColor: Colors.client.primaryColor,
              marginBottom: Metrics.addFooter + 10,
            },
          ]}>
          <Text
            style={Fonts.style.bold(Colors.light, Fonts.size.medium, 'center')}>
            {'Guardar'}
          </Text>
        </TouchableOpacity>
      </View>
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

export default EnableCoverage;
