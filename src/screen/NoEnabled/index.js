import React, {useContext} from 'react';
import {
  Alert,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Colors, Fonts, Metrics} from '../../themes';
import Icon from 'react-native-vector-icons/FontAwesome';
import {signOff} from '../../flux/auth/actions';
import {StoreContext} from '../../flux';

const NoEnabled = () => {
  const {authDispatch, state} = useContext(StoreContext);
  const {util} = state;
  const {config} = util;

  const handleWhatsapp = () => {
    let URL = ` whatsapp://send?text=${config.whatsappDefaultMessage}&phone=${config.phone}`;

    Linking.openURL(URL)
      .then((data) => {
        console.log('WhatsApp Opened');
      })
      .catch(() => {
        Alert.alert(
          'Al parecer Whatsapp no esta instalado, por favor instalado',
        );
      });
  };

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
          <TouchableOpacity
            style={{marginTop: 20}}
            onPress={() => signOff(authDispatch)}>
            <Text
              style={Fonts.style.underline(
                Colors.dark,
                Fonts.size.medium,
                'center',
              )}>
              Cerrar sesión
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => handleWhatsapp()}
        style={styles.btnContainer}>
        <Text
          style={Fonts.style.underline(
            Colors.dark,
            Fonts.size.medium,
            'center',
          )}>
          Contactar a soporte
        </Text>
      </TouchableOpacity>
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
