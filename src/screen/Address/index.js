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
  }, []);

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
            {'+ Agregar direccion'}
          </Text>
        </TouchableOpacity>
        <View opacity={0.0} style={ApplicationStyles.separatorLine} />
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: Metrics.screenWidth,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemTitleContainer: {
    marginVertical: 5,
    width: Metrics.screenWidth * 0.9,
    alignSelf: 'center',
  },
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
  contentContainer: {
    flex: 1,
    width: Metrics.screenWidth,
  },
  footerContainer: {
    flex: 0,
    flexDirection: 'row',
    width: Metrics.screenWidth,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  loading: {
    backgroundColor: Colors.loader,
    position: 'absolute',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: Metrics.screenHeight,
    width: Metrics.screenWidth,
    zIndex: 2000,
  },
  logo: {
    width: Metrics.screenWidth * 0.4,
    height: Metrics.screenWidth * 0.4,
    resizeMode: 'contain',
    marginTop: 10,
  },
  selectorContainer: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 20,
  },

  welcome: {
    fontFamily: Fonts.type.base,
    color: Colors.dark,
    marginVertical: 10,
    marginHorizontal: 20,
    fontSize: Fonts.size.h6,
    textAlignVertical: 'center',
    textAlign: 'center',
  },

  descriptorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  selectorText: {
    marginHorizontal: 20,
    fontFamily: Fonts.type.bold,
    color: Colors.dark,
    fontSize: Fonts.size.medium,
    textAlignVertical: 'center',
    textAlign: 'center',
  },
  btnText: {
    fontFamily: Fonts.type.bold,
    color: Colors.dark,
    fontSize: Fonts.size.medium,
    textAlignVertical: 'center',
    textAlign: 'center',
  },

  btnRegisterLogin: {
    flex: 0,
    width: Metrics.screenWidth / 2,
    height: 40,
    marginVertical: Metrics.addFooter * 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnContainer: {
    flex: 0,
    height: 60 + Metrics.addFooter,
    width: Metrics.screenWidth,
    alignSelf: 'center',
    borderTopLeftRadius: Metrics.borderRadius,
    borderTopRightRadius: Metrics.borderRadius,
    paddingBottom: Metrics.addFooter,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.client.primaryColor,
    shadowColor: Colors.dark,
    shadowOffset: {
      width: 2,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 1,

    elevation: 5,
  },
  linearGradient: {
    flex: 1,
    width: Metrics.screenWidth,
    height: Metrics.screenHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Address;
