import React, {useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

import MyTextInput from '../../../../../components/MyTextInput';
import {Fonts, Colors} from '../../../../../themes';
import auth from '@react-native-firebase/auth';

const UpdatePassword = () => {
  const [passwordCurrent, setPasswordCurrent] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const reauthenticate = () => {
    const currentUser = auth().currentUser;
    const cred = auth.EmailAuthProvider.credential(
      currentUser.email,
      passwordCurrent,
    );
    return currentUser.reauthenticateWithCredential(cred);
  };
  const updateProfile = async () => {
    Keyboard.dismiss();

    if (newPassword === '' || passwordCurrent === '') {
      Alert.alert('Ups...', 'Completa o verifica los datos para continuar');
    } else if (newPassword !== newPasswordConfirm) {
      Alert.alert('Ups...', 'Las contraseñas ingresadas con coinciden');
    } else {
      setLoading(true);
      await reauthenticate(passwordCurrent)
        .then(() => {
          const currentUser = auth().currentUser;
          currentUser
            .updatePassword(newPassword)
            .then(() => {
              Alert.alert(
                'Que bien....',
                'Contraseña actualizado satisfactoriamente',
              );

              setNewPassword('');
              setNewPasswordConfirm('');
              setPasswordCurrent('');
              setLoading(false);
            })
            .catch((error) => {
              console.log('error ==>', error);
              setLoading(false);
              Alert.alert(
                'Ups...',
                'Algo salio mal, intentalo de nuevo mas adelante.',
              );
            });
        })
        .catch((error) => {
          console.log('error ==>', error);
          setLoading(false);
          Alert.alert(
            'Ups...',
            'Algo salio mal, intentalo de nuevo mas adelante.',
          );
        });
    }
  };

  return (
    <View styles={styles.container}>
      <View style={{marginVertical: 20}}>
        <Icon
          style={[
            {
              color: Colors.expert.primaryColor,
              fontSize: 30,
              marginVertical: 10,
              alignSelf: 'center',
            },
          ]}
          name={'lock'}
        />
        <Text
          style={[Fonts.style.regular(Colors.dark, Fonts.size.h6, 'center')]}>
          {' Actualizar datos'}
        </Text>
        <Text
          style={Fonts.style.light(Colors.data, Fonts.size.small, 'center')}>
          {'Por seguridad ingresa tu contraseña'}
        </Text>
      </View>
      <View style={{width: '90%', alignSelf: 'center', marginBottom: 20}}>
        <MyTextInput
          pHolder={'Tu Contraseña actual'}
          text={passwordCurrent}
          multiLine={false}
          onChangeText={(text) => setPasswordCurrent(text)}
          secureText={true}
          textContent={'password'}
          autoCapitalize={'none'}
        />
        <MyTextInput
          pHolder={'Nueva contraseña'}
          text={newPassword}
          multiLine={false}
          onChangeText={(text) => setNewPassword(text)}
          secureText={true}
          textContent={'password'}
          autoCapitalize={'none'}
        />
        <MyTextInput
          pHolder={'Confirma la nueva contraseña'}
          text={newPasswordConfirm}
          multiLine={false}
          onChangeText={(text) => setNewPasswordConfirm(text)}
          secureText={true}
          textContent={'password'}
          autoCapitalize={'none'}
        />
      </View>

      <TouchableOpacity
        onPress={() => updateProfile()}
        style={[styles.btnContainer]}>
        <View style={styles.conText}>
          <Text
            style={[
              Fonts.style.bold(Colors.light, Fonts.size.medium),
              {alignItems: 'center'},
            ]}>
            {'Actualizar contraseña'}{' '}
            {loading ? (
              <ActivityIndicator color={Colors.light} />
            ) : (
              <Icon
                style={[
                  {
                    color: Colors.light,
                    fontSize: 15,
                    marginVertical: 10,
                    alignSelf: 'center',
                  },
                ]}
                name={'arrow-right'}
              />
            )}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnContainer: {
    backgroundColor: Colors.expert.primaryColor,
    height: 60,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
  },
  conText: {
    alignSelf: 'center',
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'center',
  },
});

export default UpdatePassword;
