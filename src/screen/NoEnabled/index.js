import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Colors, Fonts, Metrics} from '../../themes';
import Icon from 'react-native-vector-icons/FontAwesome';

const NoEnabled = () => {
  return (
    <View style={styles.container}>
      <View>
        <Text
          style={Fonts.style.bold(Colors.dark, Fonts.size.bigTitle, 'center')}>
          {'¡ALERTA!'}
        </Text>
        <View style={styles.contIcon}>
          <Icon name={'warning'} size={50} color={Colors.client.primaryColor} />
        </View>
        <View>
          <Text
            style={[
              Fonts.style.bold(Colors.dark, Fonts.size.h6, 'center'),
              {marginTop: 20},
            ]}>
            {'Lo sentimos tu cuenta a sido bloqueada!'}
          </Text>
          <Text
            style={[
              Fonts.style.regular(Colors.dark, Fonts.size.medium, 'center'),
              {marginTop: 20},
            ]}>
            {
              'Detectamos  algo inusual con tu cuenta por favor contacta a soporte para mas información'
            }
          </Text>
        </View>
      </View>
      <View style={styles.btnContainer}>
        <Text
          style={Fonts.style.underline(
            Colors.dark,
            Fonts.size.medium,
            'center',
          )}>
          Contactar a soporte
        </Text>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Metrics.addHeader + 40,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    backgroundColor: Colors.light,
  },
  contIcon: {alignSelf: 'center', marginVertical: 20},
  btnContainer: {marginBottom: 100},
});
export default NoEnabled;
