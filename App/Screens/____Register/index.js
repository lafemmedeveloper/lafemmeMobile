/**
 * Sample React Native App with Firebase
 * https://github.com/invertase/react-native-firebase
 *
 * @format
 * @flow
 */

import React, {Component, useContext, useEffect} from 'react';
import {
  Platform,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
  // TextInput
} from 'react-native';

import {Colors, Fonts, Images, Metrics, ApplicationStyles} from '../../Themes';

import styles from './styles';
import MyTextInput from '../../Components/MyTextInput';

export default function Register({navigation}) {
  const [userEmail, onChangeEmail] = React.useState('');
  const [userPassword, onChangePassword] = React.useState('');
  const [userFirstName, onChangeFirstName] = React.useState('');
  const [userLastName, onChangeLastName] = React.useState('');
  const [userPhone, onChangePhone] = React.useState('');
  function createUser() {
    register(
      {userEmail, userPassword, userFirstName, userLastName, userPhone},
      userDispatch,
    );
  }
  function goTo(view) {
    navigation.navigate(view);
  }

  return (
    <View style={styles.container}>
      <ScrollView style={ApplicationStyles.scrollHome}>
        <Text style={Fonts.style.bold(Colors.dark, Fonts.size.h6, 'center')}>
          {'Register View'}
        </Text>
        <MyTextInput
          pHolder={'Nombre'}
          text={userFirstName}
          onChangeText={text => onChangeFirstName(text)}
          secureText={false}
          textContent={'name'}
          autoCapitalize={'words'}
        />
        <MyTextInput
          pHolder={'Apellido'}
          text={userLastName}
          onChangeText={text => onChangeLastName(text)}
          secureText={false}
          textContent={'familyName'}
          autoCapitalize={'words'}
        />
        <MyTextInput
          pHolder={'Email'}
          text={userEmail}
          onChangeText={text => onChangeEmail(text)}
          secureText={false}
          textContent={'emailAddress'}
          autoCapitalize={'none'}
        />
        <MyTextInput
          pHolder={'Password'}
          text={userPassword}
          onChangeText={text => onChangePassword(text)}
          secureText={true}
          textContent={'password'}
          autoCapitalize={'none'}
        />
        <MyTextInput
          pHolder={'Teléfono (opcional)'}
          text={userPhone}
          onChangeText={text => onChangePhone(text)}
          secureText={false}
          textContent={'telephoneNumber'}
          autoCapitalize={'none'}
        />
        <TouchableOpacity onPress={createUser}>
          <Text style={Fonts.style.bold(Colors.dark, Fonts.size.h6, 'center')}>
            Registráte
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => goTo('Login')}>
          <Text
            style={Fonts.style.regular(
              Colors.dark,
              Fonts.size.small,
              'center',
            )}>
            ¿Ya tienes una cuenta?, Ingresa.
          </Text>
        </TouchableOpacity>
        <View style={{height: 20}}></View>
      </ScrollView>
    </View>
  );
}
