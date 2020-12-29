import React, {useState, useContext} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Keyboard,
  Image,
} from 'react-native';
import {Colors, Metrics, Fonts, ApplicationStyles, Images} from '../../themes';
import auth from '@react-native-firebase/auth';
import CountryPicker from 'react-native-country-picker-modal';
import {parsePhoneNumberFromString} from 'libphonenumber-js';
import InputCode from './InputCode';
import Register from '../../screen//Register';
import {StoreContext} from '../../flux';
import ModalApp from '../../components/ModalApp';
import {setUser} from '../../flux/auth/actions';
import Loading from '../../components/Loading';
import {useKeyboard} from '../../hooks/useKeyboard';

const Login = ({setModalAuth}) => {
  const {authDispatch, state} = useContext(StoreContext);

  const initialState = {
    country: {
      cca2: 'CO',
      callingCode: '57',
    },
  };

  const [modalCode, setModalCode] = useState(false);
  const [userPhone, setUserPhone] = useState('');
  const [stateInitial, setValueState] = useState(initialState);
  const [value, setValue] = useState('');
  const [activityLoading, setActivityLoading] = useState(false);
  const [phone, setPhone] = useState('');
  const [confirmResult, setConfirmResult] = useState(null);
  const [modalRegister, setModalRegister] = useState(false);
  const [keyboardHeight] = useKeyboard();
  const _changeCountry = (country) => {
    setValueState({...stateInitial, country});
  };

  const sendPhone = async () => {
    Keyboard.dismiss();
    setActivityLoading(true);

    if (userPhone.length > 1) {
      const phoneNumber = parsePhoneNumberFromString(
        `+${stateInitial.country.callingCode} ${userPhone}`,
      );

      if (phoneNumber.formatInternational()) {
        setPhone(phoneNumber.formatInternational());
        try {
          const confirmResult = await auth().signInWithPhoneNumber(
            phoneNumber.formatInternational(),
          );

          setActivityLoading(false);
          setConfirmResult(confirmResult);

          setModalCode(true);
        } catch (error) {
          console.log('error auth =>', error);
          setActivityLoading(false);
          Alert.alert('Ups...', 'Numero incorrecto');
        }
      } else {
        setActivityLoading(false);
        Alert.alert('Ups...', 'Numero incorrecto');
      }
    } else {
      setActivityLoading(false);
      Alert.alert('Ups...', '  Por favor ingresa tu numero');
    }
  };

  const handleVerifyCode = async () => {
    try {
      setActivityLoading(true);
      await confirmResult.confirm(value);
      const currentUser = auth().currentUser;
      if (currentUser.email) {
        setUser(currentUser.uid, authDispatch);
        setModalCode(false);
        setModalAuth(false);
      } else {
        setModalCode(false);
        setModalRegister(true);
        setActivityLoading(false);
      }
    } catch (error) {
      setActivityLoading(false);
      if (
        error
          .toString()
          .includes(
            'The sms code has expired. Please re-send the verification code to try again.',
          )
      ) {
        Alert.alert(
          'Error de Autentificación',
          'el código a expirado vuelve a intentarlo nuevamente',
        );
      }
    }
  };

  return (
    <>
      {!modalRegister ? (
        <View style={{marginTop: 20}}>
          <Loading type={'client'} />
          <View opacity={0.0} style={ApplicationStyles.separatorLineMini} />

          <Image
            source={Images.message}
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
            {'Ingresa tu numero de teléfono'}
          </Text>

          <Text
            style={Fonts.style.light(Colors.data, Fonts.size.small, 'center')}>
            {'Te enviaremos un mensaje de 6 dígitos'}
          </Text>
          <View opacity={0.0} style={ApplicationStyles.separatorLineMini} />
          <View
            style={{
              flexDirection: 'row',
              alignSelf: 'center',
            }}>
            <CountryPicker
              closeable
              withFilter
              withFlagButton
              withCountryNameButton
              withFlag
              withCallingCode
              theme={{
                fontSize: Fonts.size.medium,
                filterPlaceholderTextColor: '#aaa',
              }}
              containerButtonStyle={{
                padding: 20,
                marginTop: 22,
                marginRight: 10,
                borderRadius: Metrics.borderRadius,
                backgroundColor: Colors.textInputBg,
                flexDirection: 'row',
              }}
              filterProps={{
                placeholder: 'Busca tu país',
              }}
              placeholder={`+ ${stateInitial.country.callingCode} `}
              style={{
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onSelect={(country) => _changeCountry(country)}
              cca2={stateInitial.country.cca2}
              translation={'spa'}
            />
            <TextInput
              keyboardType="numeric"
              value={userPhone}
              onChangeText={(text) => setUserPhone(text)}
              placeholder={'300 55555'}
              style={{
                width: '70%',
                padding: 20,
                marginVertical: 20,
                borderRadius: Metrics.borderRadius,
                backgroundColor: Colors.textInputBg,
                alignSelf: 'center',
              }}
            />
          </View>

          <TouchableOpacity
            onPress={() => sendPhone()}
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
              style={Fonts.style.bold(
                Colors.light,
                Fonts.size.medium,
                'center',
              )}>
              {activityLoading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                'Verificar'
              )}
            </Text>
          </TouchableOpacity>
          <View style={{height: keyboardHeight}} />
        </View>
      ) : (
        <Register
          state={state}
          dispatch={authDispatch}
          setModalCode={setModalCode}
          activityLoading={activityLoading}
          setActivityLoading={setActivityLoading}
          setModalAuth={setModalAuth}
        />
      )}
      <ModalApp open={modalCode}>
        <InputCode
          phone={phone}
          handleVerifyCode={handleVerifyCode}
          setValue={setValue}
          value={value}
          setModalCode={setModalCode}
          activityLoading={activityLoading}
        />
      </ModalApp>
    </>
  );
};

export default Login;
