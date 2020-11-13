import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';

import {StoreContext} from '../../flux';
import CardItemAddress from '../../components/CartItemAddress';
import {Metrics, Fonts, ApplicationStyles, Colors, Images} from '../../themes';
import {updateProfile} from '../../flux/auth/actions';
import {validateCoverage} from '../../helpers/GeoHelper';
import {getCoverage} from '../../flux/util/actions';
import Loading from '../../components/Loading';
import AddAddress from '../AddAddress';

const Address = ({closeModal}) => {
  const {authDispatch, state, utilDispatch} = useContext(StoreContext);
  const {auth, util} = state;
  const {user} = auth;
  const {coverageZones} = util;
  const [addAddress, setAddAddress] = useState(false);

  useEffect(() => {
    getCoverage('Medellín', utilDispatch);
  }, [utilDispatch]);

  const selectAddress = async (address) => {
    const {latitude, longitude} = address.coordinates;

    let coverage = validateCoverage(latitude, longitude, coverageZones);
    let services = user?.cart?.services ?? [];
    if (coverage) {
      await updateProfile(
        {...user.cart, address, services},
        'cart',
        authDispatch,
      );
      closeModal();
    } else {
      Alert.alert(
        'Lo sentimos',
        'Ya no tenemos cobertura en esta zona, selecciona otra dirección para continuar.',
      );
    }
  };

  const removeAddress = async (id) => {
    let address = user.address;

    const addressFilter = address.filter((a) => a.id !== id);
    if (addressFilter.length > 0) {
      await updateProfile(addressFilter, 'address', authDispatch);
    } else {
      await updateProfile(addressFilter, 'address', authDispatch);

      await updateProfile({...user.cart, address: null}, 'cart', authDispatch);
    }
  };

  return (
    <View>
      <Loading type={'client'} />
      {!addAddress ? (
        <ScrollView>
          <View opacity={0.0} style={ApplicationStyles.separatorLineMini} />

          <Image
            source={Images.address}
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
            {'Mis direcciones'}
          </Text>

          <Text
            style={Fonts.style.light(Colors.data, Fonts.size.small, 'center')}>
            {'Agrega y selecciona tu dirección de  servicio'}
          </Text>
          <View opacity={0.0} style={ApplicationStyles.separatorLineMini} />

          {user &&
            user.address &&
            user.address.map((item) => {
              return (
                <CardItemAddress
                  key={item.id}
                  data={item}
                  selectAddress={() => selectAddress(item)}
                  removeAddress={(id) => {
                    Alert.alert(
                      'Alerta',
                      'Realmente desea eliminar esta dirección de tu lista.',
                      [
                        {
                          text: 'Eliminar',
                          onPress: () => {
                            console.log('DeleteAddresss', id);
                            removeAddress(id);
                          },
                        },
                        {
                          text: 'Cancelar',
                          onPress: () => console.log('Cancel Pressed'),
                          style: 'cancel',
                        },
                      ],
                      {cancelable: true},
                    );
                  }}
                />
              );
            })}

          {user && user.address && user.address.length <= 0 && (
            <View style={{marginVertical: 50}}>
              <Text
                style={Fonts.style.bold(
                  Colors.gray,
                  Fonts.size.small,
                  'center',
                )}>
                {'No tienes direcciones, agrega una para continuar.'}
              </Text>
            </View>
          )}

          <TouchableOpacity
            onPress={() => setAddAddress(true)}
            style={styles.productContainer}>
            <Text
              style={Fonts.style.bold(
                Colors.client.primaryColor,
                Fonts.size.medium,
                'center',
              )}>
              {'+ Agregar dirección'}
            </Text>
          </TouchableOpacity>
          <View opacity={0.0} style={ApplicationStyles.separatorLine} />
        </ScrollView>
      ) : (
        <AddAddress setAddAddress={setAddAddress} />
      )}
    </View>
  );
};
const styles = StyleSheet.create({
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
});

export default Address;
