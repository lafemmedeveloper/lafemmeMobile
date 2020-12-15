import React, {useState} from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Keyboard,
  Image,
} from 'react-native';

//Modules
import auth from '@react-native-firebase/auth';
import moment from 'moment';

//Flux
import {saveUser} from '../../flux/auth/actions';

//Theme

import {Colors, Metrics, Fonts, ApplicationStyles, Images} from '../../themes';

//Components
import ModalApp from '../../components/ModalApp';
import Loading from '../../components/Loading';
import Referrals from './Referrals';

//Hooks
import {useKeyboard} from '../../hooks/useKeyboard';

const Register = ({
  dispatch,
  activityLoading,
  setActivityLoading,
  setModalAuth,
}) => {
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [referrals, setReferrals] = useState(false);
  const [keyboardHeight] = useKeyboard();

  const handleRegister = async (guestUser = null) => {
    Keyboard.dismiss();
    if ((name.trim() !== '' || lastName.trim() !== '', email.trim() !== '')) {
      const currentUser = auth().currentUser;
      try {
        setActivityLoading(true);
        await currentUser.updateProfile({
          displayName: `${name} ${lastName}`,
        });
        await currentUser.updateEmail(email);

        const emptyCart = {
          date: null,
          address: null,
          notes: null,
          services: [],
          coupon: null,
          specialDiscount: null,
        };

        const data = {
          email,
          firstName: name,
          lastName: lastName,
          numberOfServices: 0,
          phone: currentUser.phoneNumber,
          uid: currentUser.uid,
          isEnabled: true,
          role: 'client',
          tyc: moment(new Date()).format('LLLL'),
          guest: [],
          rating: 5.0,
          cart: emptyCart,
          address: [],
          imageUrl: null,
          tokens: [],
          referrals: [],
          guestUser,
        };
        console.log('data ==>', guestUser);
        await setDb(data);
        setActivityLoading(false);

        setModalAuth(false);
      } catch (error) {
        console.log('error:register', error);
        setActivityLoading(false);
        if (
          error
            .toString()
            .includes('The email address is already in use by another account.')
        ) {
          Alert.alert(
            'Ups',
            'Este correo ya esta en uso, por favor intentalo con otro',
          );
        } else if (
          error.toString().includes('  The email address is badly formatted.')
        ) {
        } else {
          Alert.alert(
            'Ups...',
            'Tuvimos problemas con tu correo, por favor verifica que este bien escrito e intentalo de nuevo',
          );
        }
      }
    } else {
      setActivityLoading(false);
      Alert.alert('Ups', 'Por favor completa tus datos');
    }
  };
  const setDb = (data) => {
    console.log('is active registrer');
    saveUser(data, dispatch);
  };

  return (
    <>
      <Loading type={'client'} />

      <View style={{marginTop: 20}}>
        <View opacity={0.0} style={ApplicationStyles.separatorLineMini} />

        <Image
          source={Images.user}
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
          {'Registrarte'}
        </Text>
        <Text
          style={Fonts.style.light(Colors.dark, Fonts.size.small, 'center')}>
          Ingresa tus datos para continuar
        </Text>
        <View opacity={0.0} style={ApplicationStyles.separatorLineMini} />

        <View
          style={{
            flex: 0,
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
          <TextInput
            value={name}
            autoCapitalize={'words'}
            onChangeText={(text) => setName(text)}
            placeholder={'Nombre'}
            style={{
              width: '45%',
              padding: 10,
              marginVertical: 20,
              borderRadius: Metrics.borderRadius,
              backgroundColor: Colors.textInputBg,
              alignSelf: 'center',
              marginRight: 5,
            }}
          />
          <TextInput
            value={lastName}
            onChangeText={(text) => setLastName(text)}
            placeholder={'Apellido'}
            autoCapitalize={'words'}
            style={{
              width: '45%',
              padding: 10,
              marginVertical: 20,
              borderRadius: Metrics.borderRadius,
              backgroundColor: Colors.textInputBg,
              alignSelf: 'center',
              marginLeft: 5,
            }}
          />
        </View>
        <TextInput
          value={email}
          onChangeText={(text) => setEmail(text)}
          placeholder={'Correo example (JhoeDo@correo.com)'}
          autoCapitalize={'none'}
          style={{
            width: '95%',
            padding: 10,
            marginBottom: 40,
            borderRadius: Metrics.borderRadius,
            backgroundColor: Colors.textInputBg,
            alignSelf: 'center',
            marginLeft: 5,
          }}
        />

        <TouchableOpacity
          onPress={() =>
            Alert.alert(
              'Hey',
              '¿Fuiste referido por un usuario de la Femme?',
              [
                {
                  text: 'Si',
                  onPress: () => setReferrals(true),
                },

                {
                  text: 'No',
                  onPress: () => handleRegister(),
                  style: 'cancel',
                },
              ],
              {cancelable: false},
            )
          }
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
              shadowColor: Colors.dark,
              shadowOffset: {
                width: 2,
                height: 1,
              },
              shadowOpacity: 0.25,
              shadowRadius: 1,

              elevation: 5,
            },
          ]}>
          <Text
            style={Fonts.style.bold(Colors.light, Fonts.size.medium, 'center')}>
            {activityLoading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              'Siguiente'
            )}
          </Text>
        </TouchableOpacity>
        <View style={{height: keyboardHeight}} />
      </View>
      <ModalApp open={referrals} setOpen={setReferrals}>
        <Referrals handleRegister={handleRegister} close={setReferrals} />
      </ModalApp>
    </>
  );
};

export default Register;
