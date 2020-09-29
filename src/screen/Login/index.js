import React, {useState, useContext} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  StyleSheet,
  Keyboard,
} from 'react-native';
import {Colors, Metrics, Fonts} from '../../themes';
import auth from '@react-native-firebase/auth';
import CountryPicker from 'react-native-country-picker-modal';
import {parsePhoneNumberFromString} from 'libphonenumber-js';
import InputCode from './InputCode';
import Register from '../../screen//Register';
import {StoreContext} from '../../flux';
import ModalApp from '../../components/ModalApp';
import {setUser} from '../../flux/auth/actions';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Loading from '../../components/Loading';

const Login = (props) => {
  const {setModalAuth} = props;
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
      console.log('currentUser ===>', currentUser);
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
          <Icon
            name="email-send-outline"
            size={50}
            color={Colors.client.primaryColor}
            style={styles.icon}
          />
          <Text style={Fonts.style.bold(Colors.dark, Fonts.size.h6, 'center')}>
            {'Verifica tu numero'}
          </Text>
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
              },
            ]}>
            <Text
              style={Fonts.style.bold(
                Colors.light,
                Fonts.size.medium,
                'center',
              )}>
              Verificar
            </Text>
            {activityLoading && (
              <ActivityIndicator size="small" color="white" />
            )}
          </TouchableOpacity>
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
const styles = StyleSheet.create({
  icon: {
    alignSelf: 'center',
    paddingVertical: 20,
  },
});
export default Login;
