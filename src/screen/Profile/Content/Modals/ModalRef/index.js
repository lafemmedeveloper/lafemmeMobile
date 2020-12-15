import React, {useContext, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {StoreContext} from '../../../../../flux';
import {updateProfile} from '../../../../../flux/auth/actions';
import {ApplicationStyles, Colors, Fonts, Metrics} from '../../../../../themes';
import moment from 'moment';
import Utilities from '../../../../../utilities';

const ModalRef = ({user, close}) => {
  const {authDispatch, state} = useContext(StoreContext);
  const {util, service} = state;
  const {config} = util;
  const {services} = service;
  const [loading, setLoading] = useState(false);

  const activeCoupon = async (data, index) => {
    if (user.cart.coupon) {
      return Alert.alert(
        'Lo siento',
        'Solo se permite un descuento por servicio',
      );
    }

    setLoading(true);
    //service[index].total = (25 / 100) * service[0].total - service[0].total;

    //  await updateProfile({...user.cart, service}, 'cart', authDispatch);

    let arrayRef = user.referrals.filter((u) => u.uid === data.uid);
    arrayRef[0].used = true;

    const dateExpired = moment().add(30, 'day');
    let slugs = [];
    for (let index = 0; index < services.length; index++) {
      slugs.push(services[index].slug);
    }

    const coupon = {
      title: 'Referido',
      campain: 'Referido',
      coupon: 'Cupón de referido',
      create: Date.now(),
      existence: 1,
      expires: dateExpired.format('YYYY-MM-DD HH:mm:ss'),
      description: `Tienes un ${config.referrals}% de descuento en todos tus servicios, tienes un mes para consumirlo`,
      typeCoupon: 'percentage',
      isEnabled: true,
      id: Utilities.create_UUID(),
      minValue: 0,
      money: 0,
      percentage: config.referrals,
      type: slugs,
    };

    await updateProfile(arrayRef, 'referrals', authDispatch);
    await updateProfile(
      {
        coupon,
      },
      'cart',
      authDispatch,
    );
    setLoading(false);

    Alert.alert(
      'Genial',
      `Se realizo un ${config.referrals}% de descuento a todos tu servicios`,
      [{text: 'OK', onPress: () => close(false)}],
    );
  };

  return (
    <View style={styles.container}>
      <View opacity={0.0} style={ApplicationStyles.separatorLineMini} />
      <Icon
        name="exchange-alt"
        size={50}
        color={Colors.client.primaryColor}
        style={{
          alignSelf: 'center',
          marginBottom: 10,
        }}
      />

      <Text style={Fonts.style.bold(Colors.dark, Fonts.size.h6, 'center')}>
        {'Referidos'}
      </Text>

      <Text style={Fonts.style.light(Colors.data, Fonts.size.small, 'center')}>
        {`Comparte tu teléfono con tus amigos y familiares
        para que disfrutes de un ${config.referrals}% de descuento
         en todos tus servicios`}
      </Text>
      <View opacity={0.0} style={ApplicationStyles.separatorLineMini} />
      <ScrollView style={{marginTop: 20, marginHorizontal: 20}}>
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
                    style={Fonts.style.bold(
                      Colors.dark,
                      Fonts.size.medium,
                    )}>{`${data.firstName} ${data.lastName}`}</Text>
                  <Text
                    style={Fonts.style.regular(Colors.dark, Fonts.size.small)}>
                    {data.createRef}
                  </Text>
                </View>
                <TouchableOpacity
                  disabled={data.used}
                  onPress={() => activeCoupon(data, index)}
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
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {maxHeight: Metrics.screenHeight - 100},
  btn: {
    width: Metrics.screenWidth * 0.3,
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
