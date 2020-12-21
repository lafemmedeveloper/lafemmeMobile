/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect} from 'react';
import {Text, View, TouchableOpacity, Image} from 'react-native';
//Modules
import Icon from 'react-native-vector-icons/FontAwesome5';

//Theme
import {
  Metrics,
  Colors,
  Fonts,
  ApplicationStyles,
  Images,
} from '../../../themes';

const NoEnableCoverage = ({
  notifyCoverage,
  setIsCoverage,
  setNotifyCoverage,
  setGoogleAddress,
}) => {
  useEffect(() => {
    setGoogleAddress(null);
  }, []);

  return (
    <>
      <View
        style={{
          alignSelf: 'center',
          width: Metrics.screenWidth * 0.9,
          backgroundColor: Colors.light,
          backdropColor: 'red',
          borderRadius: 10,
          marginVertical: 20,
          zIndex: 10000000,
        }}>
        <View opacity={0.0} style={ApplicationStyles.separatorLineMini} />

        <Image
          source={Images.noConection}
          style={{
            height: 90,
            resizeMode: 'contain',
            alignSelf: 'center',
            marginBottom: 10,
            tintColor: Colors.client.primaryColor,
          }}
        />
        <Text style={Fonts.style.bold(Colors.dark, Fonts.size.h6, 'center')}>
          {'Dirección no disponible'}
        </Text>

        <Text
          style={Fonts.style.light(Colors.data, Fonts.size.small, 'center')}>
          {'Lo sentimos actualmente no tenemos cobertura en esta zona'}
        </Text>
        <View opacity={0.0} style={ApplicationStyles.separatorLineMini} />

        <View
          style={{
            width: '90%',
            alignSelf: 'center',
            marginVertical: 5,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity onPress={() => setNotifyCoverage(!notifyCoverage)}>
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
        onPress={() => setIsCoverage(0)}
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
          style={[
            Fonts.style.bold(Colors.light, Fonts.size.medium),
            {textAlign: 'center'},
          ]}>
          {'Continuar'}
        </Text>
      </TouchableOpacity>
    </>
  );
};

export default NoEnableCoverage;
