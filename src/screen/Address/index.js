import React, {useContext, useEffect} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';

import {StoreContext} from '../../flux';
import CardItemAddress from '../../components/CartItemAddress';
import {Metrics, Fonts, ApplicationStyles, Colors} from '../../themes';
import {updateProfile} from '../../flux/auth/actions';
import {validateCoverage} from '../../helpers/GeoHelper';
import {getCoverage} from '../../flux/util/actions';

const Address = (props) => {
  const {closeModal, setModalCart, setModalAddAddress} = props;

  const {authDispatch, state, utilDispatch} = useContext(StoreContext);
  const {auth, util} = state;
  const {user} = auth;
  const {coverageZones} = util;

  useEffect(() => {
    getCoverage('Medellín', utilDispatch);
  }, [utilDispatch]);

  const selectAddress = async (address) => {
    const {latitude, longitude} = address.coordinates;

    let coverage = validateCoverage(latitude, longitude, coverageZones);

    if (coverage) {
      await updateProfile({...user.cart, address}, 'cart', authDispatch);
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

    const index = address ? address.findIndex((i) => i.id === id) : -1;

    if (index !== -1) {
      address = [...address.slice(0, index), ...address.slice(index + 1)];

      if (user.cart.address != null && user.cart.address.id === id) {
        await updateProfile(
          {...user.cart, address: null},
          'cart',
          authDispatch,
        );
      }

      await updateProfile(address, 'address', authDispatch);
    }
  };

  const changeScreen = () => {
    closeModal(false);
    setModalCart(false);
    setModalAddAddress(true);
  };

  return (
    <View>
      <ScrollView>
        <View style={styles.headerContainer}>
          <View opacity={0.0} style={ApplicationStyles.separatorLine} />
          <Text style={Fonts.style.bold(Colors.dark, Fonts.size.h6, 'center')}>
            {'Mis direcciones'}
          </Text>
          <View opacity={0.0} style={ApplicationStyles.separatorLine} />
        </View>

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
              style={Fonts.style.bold(Colors.gray, Fonts.size.small, 'center')}>
              {'No tienes direcciones, agrega una para continuar.'}
            </Text>
          </View>
        )}

        <TouchableOpacity
          onPress={() => changeScreen()}
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

  headerContainer: {
    flex: 0,
    width: Metrics.screenWidth,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});

export default Address;
