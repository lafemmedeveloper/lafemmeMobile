import React, {useContext, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import MyTextInput from '../../../components/MyTextInput';
import {StoreContext} from '../../../flux';
import {updateProfile} from '../../../flux/auth/actions';
import {addCoupon, valdiateCouponDb} from '../../../flux/util/actions';
import {Colors, Fonts, Metrics} from '../../../themes';
import utilities from '../../../utilities';

const ModalCuopon = ({total, type, close}) => {
  const {state, utilDispatch, authDispatch} = useContext(StoreContext);
  const [coupon, setCoupon] = useState('');
  const {util, auth} = state;
  const {user} = auth;

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
      <Icon
        name="barcode"
        size={50}
        color={Colors.client.primaryColor}
        style={{alignSelf: 'center', marginVertical: 20, paddingTop: 20}}
      />
      <Text style={Fonts.style.bold(Colors.dark, Fonts.size.h6, 'center')}>
        {'Agrega un cupón'}
      </Text>
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
      <View style={{marginTop: 20}}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => valdiateCoupon()}>
          {util.loading || auth.loading ? (
            <ActivityIndicator color={Colors.light} />
          ) : (
            <Text
              style={Fonts.style.bold(
                Colors.light,
                Fonts.size.medium,
                'center',
              )}>
              Validar cupón
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  contInput: {
    marginHorizontal: 20,
  },
  button: {
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
});

export default ModalCuopon;
