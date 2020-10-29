import React, {useContext, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {StoreContext} from '../../../../../flux';
import {updateProfile} from '../../../../../flux/auth/actions';
import {Colors, Fonts, Metrics} from '../../../../../themes';

const ModalRef = ({user}) => {
  const {authDispatch} = useContext(StoreContext);

  const [loading, setLoading] = useState(false);

  const activeCoupon = async (data) => {
    const cart = user.cart.services.length;
    if (user.cart.coupon) {
      return Alert.alert(
        'Lo siento',
        'Solo se permite un descuento por servicio',
      );
    }
    if (cart === 0) {
      return Alert.alert(
        'Lo siento',
        'Primero agrega un servicio para hacer el descuento',
      );
    }
    setLoading(true);
    let service = user.cart.services;
    service[0].total = (25 / 100) * service[0].total - service[0].total;

    await updateProfile({...user.cart, service}, 'cart', authDispatch);

    let arrayRef = user.referrals.filter((u) => u.uid === data.uid);
    arrayRef[0].used = true;

    await updateProfile(arrayRef, 'referrals', authDispatch);
    setLoading(false);

    Alert.alert('Genial', 'Se realizo un 25% de descuento a tu orden');
  };

  return (
    <View style={styles.container}>
      <View style={{marginTop: 20}}>
        {user && user.referrals && user.referrals.length > 0 ? (
          user.referrals.map((data, index) => {
            console.log(data.used);
            return (
              <View
                key={index}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginHorizontal: 10,
                  marginVertical: 5,
                }}>
                <View>
                  <Text
                    style={Fonts.style.regular(
                      Colors.dark,
                      Fonts.size.medium,
                    )}>{`${data.firstName} ${data.lastName}`}</Text>
                  <Text
                    style={Fonts.style.regular(Colors.dark, Fonts.size.medium)}>
                    {data.createRef}
                  </Text>
                </View>
                <TouchableOpacity
                  disabled={data.used}
                  onPress={() => activeCoupon(data)}
                  style={!data.used ? styles.btn : styles.btnInactive}>
                  {loading ? (
                    <ActivityIndicator color={Colors.light} />
                  ) : (
                    <Text
                      style={Fonts.style.bold(
                        Colors.light,
                        Fonts.size.medium,
                        'center',
                        1,
                      )}>
                      {!data.used ? 'Usar' : 'Usado'}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            );
          })
        ) : (
          <Text
            style={[
              Fonts.style.semiBold(Colors.dark, Fonts.size.h6, 'center'),
              {marginVertical: 20},
            ]}>
            Lo Siento no tienes referidos
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {maxHeight: Metrics.screenHeight - 100},
  btn: {
    width: Metrics.screenWidth * 0.2,
    height: 40,
    marginVertical: 10,
    alignSelf: 'center',
    borderRadius: Metrics.borderRadius,
    backgroundColor: Colors.client.primaryColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnInactive: {
    width: Metrics.screenWidth * 0.2,
    height: 40,
    marginVertical: 10,
    alignSelf: 'center',
    borderRadius: Metrics.borderRadius,
    backgroundColor: Colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ModalRef;
