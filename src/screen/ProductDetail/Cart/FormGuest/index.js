import React from 'react';
import MyTextInput from '../../../../components/MyTextInput';
import {View, Text, TouchableOpacity, Alert, Image} from 'react-native';
import {
  Fonts,
  Colors,
  Metrics,
  ApplicationStyles,
  Images,
} from '../../../../themes';
import {useKeyboard} from '../../../../hooks/useKeyboard';

const FormGuest = (props) => {
  const {form, setForm, addGuest} = props;
  const {firstName, lastName, email, phone} = form;

  const handleOk = () => {
    if (firstName === '' || lastName === '' || email === '') {
      Alert.alert('Ups', 'Todos los campos son necesarios');
    } else {
      addGuest();
    }
  };
  const [keyboardHeight] = useKeyboard();

  return (
    <View style={{width: '90%', alignSelf: 'center'}}>
      <View style={{marginVertical: 20}}>
        <View opacity={0.0} style={ApplicationStyles.separatorLineMini} />

        <Image
          source={Images.guest}
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
          {'Agregar nuevo invitado'}
        </Text>

        <Text
          style={Fonts.style.light(Colors.data, Fonts.size.small, 'center')}>
          {'Agrega invitados a tu servicio'}
        </Text>
        <View opacity={0.0} style={ApplicationStyles.separatorLineMini} />
        <MyTextInput
          pHolder={'Nombre'}
          text={firstName}
          onChangeText={(text) => setForm({...form, firstName: text})}
          secureText={false}
          textContent={'name'}
          autoCapitalize={'words'}
        />
        <MyTextInput
          pHolder={'Apellido'}
          text={lastName}
          onChangeText={(text) => setForm({...form, lastName: text})}
          secureText={false}
          textContent={'name'}
          autoCapitalize={'words'}
        />

        <MyTextInput
          pHolder={'Email'}
          text={email}
          onChangeText={(text) => setForm({...form, email: text})}
          secureText={false}
          textContent={'name'}
          autoCapitalize={'none'}
        />
        <MyTextInput
          pHolder={'Teléfono (opcional)'}
          text={phone}
          onChangeText={(text) => setForm({...form, phone: text})}
          secureText={false}
          textContent={'telephoneNumber'}
          autoCapitalize={'none'}
        />
        <View style={{height: keyboardHeight}} />
      </View>

      <TouchableOpacity
        onPress={() => handleOk()}
        style={{
          flex: 0,
          height: 40,
          width: Metrics.contentWidth,
          alignSelf: 'center',
          borderRadius: Metrics.borderRadius,
          marginVertical: 20,
          backgroundColor: Colors.client.primaryColor,
          justifyContent: 'center',
          alignItems: 'center',

          shadowColor: Colors.dark,
          shadowOffset: {
            width: 2,
            height: 1,
          },
          shadowOpacity: 0.25,
          shadowRadius: 1,

          elevation: 5,
        }}>
        <Text
          style={Fonts.style.bold(Colors.light, Fonts.size.medium, 'center')}>
          Agregar Invitado
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default FormGuest;
