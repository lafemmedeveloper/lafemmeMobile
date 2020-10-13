import React from 'react';
import MyTextInput from '../../../../components/MyTextInput';
import {View, Text, TouchableOpacity, Alert} from 'react-native';
import {Fonts, Colors, Metrics} from '../../../../themes';

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
  return (
    <View style={{width: '90%', alignSelf: 'center'}}>
      <View style={{marginVertical: 20}}>
        <Text
          style={[
            Fonts.style.bold(Colors.dark, Fonts.size.medium, 'center', 1),
            {marginVertical: 10},
          ]}>
          Agregar un nuevo invitado
        </Text>
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
          autoCapitalize={'none'}
        />

        <MyTextInput
          pHolder={'Email'}
          text={email}
          onChangeText={(text) => setForm({...form, email: text})}
          secureText={false}
          textContent={'name'}
          autoCapitalize={''}
        />
        <MyTextInput
          pHolder={'Teléfono (opcional)'}
          text={phone}
          onChangeText={(text) => setForm({...form, phone: text})}
          secureText={false}
          textContent={'telephoneNumber'}
          autoCapitalize={'none'}
        />
      </View>
      <TouchableOpacity
        onPress={() => handleOk()}
        style={[
          {
            flex: 0,
            borderRadius: Metrics.textInBr,
            alignSelf: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
            width: '100%',

            paddingHorizontal: 10,
            paddingVertical: 10,
            backgroundColor: Colors.expert.primaryColor,
            marginBottom: Metrics.addFooter + 10,
          },
        ]}>
        <Text
          style={Fonts.style.bold(Colors.light, Fonts.size.medium, 'center')}>
          Agregar Invitado
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default FormGuest;
