import React, {useState} from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
  Keyboard,
} from 'react-native';
import {Colors, Metrics, Fonts} from '../../themes';
import moment from 'moment';
import auth from '@react-native-firebase/auth';
import {saveUser} from '../../flux/auth/actions';
import Icon from 'react-native-vector-icons/FontAwesome5';

const Register = (props) => {
  const {dispatch, activityLoading, setActivityLoading, setModalAuth} = props;

  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');

  const chandleRegister = async () => {
    Keyboard.dismiss();
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
          numberOfServices: 0,
          phone: currentUser.phoneNumber,
          uid: currentUser.uid,
          role: 'client',
          tyc: moment(new Date()).format('LLLL'),
          guest: [],
          rating: 5.0,
          cart: null,
          address: [],
          imageUrl: null,
          tokens: [],
        };
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
      <View style={{marginTop: 20}}>
        <Icon
          name="user-edit"
          size={50}
          color={Colors.client.primaryColor}
          style={styles.icon}
        />
        <Text style={Fonts.style.bold(Colors.dark, Fonts.size.h6, 'center')}>
          {'Completa tus datos para continuar'}
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
const styles = StyleSheet.create({
  icon: {
    alignSelf: 'center',
    paddingVertical: 20,
  },
});

export default Register;
