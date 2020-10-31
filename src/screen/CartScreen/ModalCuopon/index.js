import React, {useContext, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Keyboard,
  Image,
} from 'react-native';
import MyTextInput from '../../../components/MyTextInput';
import {StoreContext} from '../../../flux';
import {updateProfile} from '../../../flux/auth/actions';
import {addCoupon, valdiateCouponDb} from '../../../flux/util/actions';
import {useKeyboard} from '../../../hooks/useKeyboard';
import {
  ApplicationStyles,
  Colors,
  Fonts,
  Images,
  Metrics,
} from '../../../themes';
import utilities from '../../../utilities';

const ModalCuopon = ({total, type, close}) => {
  const {state, utilDispatch, authDispatch} = useContext(StoreContext);
  const [coupon, setCoupon] = useState('');
  const {util, auth} = state;
  const {user} = auth;
  const [keyboardHeight] = useKeyboard();

  const valdiateCoupon = async () => {
    Keyboard.dismiss();
    if (coupon === '') {
      return Alert.alert('Ups', 'Ingresa un cupón');
    }
    const response = await valdiateCouponDb(coupon, utilDispatch);
    if (!response) {
      return Alert.alert('Ups', 'Lo siento, cupón inexistente');
    }

    if (response) {
      const currentDate = new Date();
      const experedCuopon = Date.parse(response.expires);

      if (util.cuopon) {
        //Validate one cuopon
        return Alert.alert(
          'Ups',
          'Lo siento, solo se permito un cupón por servicio',
        );
      }

      if (currentDate > experedCuopon) {
        //validate date
        return Alert.alert('Ups', 'Lo siento, tu cupón ya expiro');
      }

      if (total < response.minValue) {
        //Validate min value
        return Alert.alert(
          'Ups',
          `Lo siento el monto mínimo para usar este cupón es de ${utilities.formatCOP(
            // eslint-disable-next-line radix
            parseInt(response.minValue),
          )}`,
        );
      }
      if (!response.type.includes(type)) {
        //Validate service
        return Alert.alert(
          'Ups',
          `Lo siento tu cupón no es valido para el servicio de  ${utilities.capitalize(
            type.split('-').join(' '),
          )}`,
        );
      }

      //Active coupon
      await updateProfile(
        {...user.cart, coupon: response},
        'cart',
        authDispatch,
      );
      const math = response.existence - 1;
      await addCoupon(response.id, math, utilDispatch);
      Alert.alert(
        'Excelente',
        'Tu cupón fue agregado con éxito, veras reflejado el descuento en el en el total de tu carrito ',
      );

      close(false);
    }
  };

  return (
    <View>
      <View opacity={0.0} style={ApplicationStyles.separatorLineMini} />
      <Image
        source={Images.coupon}
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
        {'Agregar cupón'}
      </Text>

      <Text style={Fonts.style.light(Colors.data, Fonts.size.small, 'center')}>
        {'Agrega descuento a tus servicios con cupones'}
      </Text>
      <View opacity={0.0} style={ApplicationStyles.separatorLineMini} />
      <View style={styles.contInput}>
        <MyTextInput
          pHolder={'Ingresa tu cupón'}
          text={coupon}
          multiLine={false}
          onChangeText={(text) => setCoupon(text.trim())}
          secureText={false}
          textContent={'none'}
          autoCapitalize={'none'}
        />
      </View>

      <TouchableOpacity
        onPress={() => valdiateCoupon()}
        style={[
          styles.button,
          {
            backgroundColor: Colors.client.primaryColor,
          },
        ]}>
        {util.loading || auth.loading ? (
          <ActivityIndicator color={Colors.light} />
        ) : (
          <Text
            style={Fonts.style.bold(Colors.light, Fonts.size.medium, 'center')}>
            Validar cupón
          </Text>
        )}
      </TouchableOpacity>

      <View style={{height: keyboardHeight}} />
    </View>
  );
};
const styles = StyleSheet.create({
  contInput: {
    marginHorizontal: 20,
  },
  button: {
    flex: 0,
    height: 40,
    width: Metrics.contentWidth,
    alignSelf: 'center',
    borderRadius: Metrics.borderRadius,
    marginVertical: 20,

    justifyContent: 'center',
    alignItems: 'center',

    shadowColor: Colors.dark,
    shadowOffset: {
      width: 2,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 1,

    elevation: 5,
  },
});

export default ModalCuopon;
