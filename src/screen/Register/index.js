import React, {useState} from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {Colors, Metrics, Fonts} from 'App/themes';
import moment from 'moment';
import auth from '@react-native-firebase/auth';
import {saveUser} from 'App/flux/auth/actions';

const Register = (props) => {
  const {
    dispatch,
    activityLoading,
    setActivityLoading,
    setModalRegister,
    setModalAuth,
  } = props;

  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');

  const chandleRegister = async () => {
    if ((name.trim() !== '' || lastName.trim() !== '', email.trim() !== '')) {
      const currentUser = auth().currentUser;
      try {
        setActivityLoading(true);
        await currentUser.updateProfile({
          displayName: `${name} ${lastName}`,
        });
        await currentUser.updateEmail(email);

        const data = {
          email,
          firstName: name,
          lastName: lastName,
          phone: currentUser.phoneNumber,
          uid: currentUser.uid,
          role: 'client',
          tyc: moment(new Date()).format('LLLL'),
          guest: [],
          rating: 5,
          cart: null,
        };
        setActivityLoading(false);
        setDb(data);
        setModalRegister(false);
        setModalAuth(false);
      } catch (error) {
        console.log('error:register', error);
        setActivityLoading(false);
        if (
          error
            .toString()
            .includes('The email address is already in use by another account.')
        ) {
          Alert.alert('Error de Autentificación', 'authError');
        } else {
          Alert.alert(
            'Ups...',
            'Tuvimos un problema procesando tu solicitud, por favor intentalo de nuevo',
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
      <View style={{marginTop: 20}}>
        <Text style={Fonts.style.bold(Colors.dark, Fonts.size.h6, 'center')}>
          {'Hola, Completa tus datos para continuar'}
        </Text>
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
            placeholder={'Tu Nombre'}
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
            placeholder={'Tu Apellido'}
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
          placeholder={'TuCorre@ejemplo.com'}
          autoCapitalize={'none'}
          style={{
            width: '95%',
            padding: 10,
            marginVertical: 20,
            borderRadius: Metrics.borderRadius,
            backgroundColor: Colors.textInputBg,
            alignSelf: 'center',
            marginLeft: 5,
          }}
        />

        <TouchableOpacity
          onPress={() => chandleRegister()}
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
            style={Fonts.style.bold(Colors.light, Fonts.size.medium, 'center')}>
            Siguiente
          </Text>
          {activityLoading && <ActivityIndicator size="small" color="white" />}
        </TouchableOpacity>
      </View>
    </>
  );
};

export default Register;
