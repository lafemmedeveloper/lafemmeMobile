import React from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import {Metrics, Colors, Fonts} from '../../../themes';
import Icon from 'react-native-vector-icons/FontAwesome5';

const NoEnableCoverage = (props) => {
  const {
    notifyCoverage,
    setIsCoverage,
    setNotifyCoverage,
    currentLocationActive,
    googleAddress,
  } = props;
  return (
    <>
      <View
        style={{
          alignSelf: 'center',
          width: Metrics.screenWidth * 0.6,
          backgroundColor: Colors.light,
          backdropColor: 'red',
          borderRadius: 10,
          marginVertical: 20,
        }}>
        <Text
          style={[
            Fonts.style.bold(Colors.dark, Fonts.size.h6, 'center'),
            {marginVertical: 10},
          ]}>
          {'Lo Sentimos'}
        </Text>
        {currentLocationActive ? (
          <Text
            style={Fonts.style.regular(
              Colors.dark,
              Fonts.size.medium,
              'center',
            )}>
            {'La dirección ingresada no tiene cobertura.'}
          </Text>
        ) : (
          <Text
            style={Fonts.style.regular(
              Colors.dark,
              Fonts.size.medium,
              'center',
            )}>
            {`La dirección ${googleAddress} no tiene cobertura. `}
          </Text>
        )}

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
