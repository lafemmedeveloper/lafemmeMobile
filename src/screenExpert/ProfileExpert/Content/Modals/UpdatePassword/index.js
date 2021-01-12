import React, {useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Keyboard,
  Image,
} from 'react-native';

import MyTextInput from '../../../../../components/MyTextInput';
import {
  Fonts,
  Colors,
  ApplicationStyles,
  Images,
  Metrics,
} from '../../../../../themes';
import auth from '@react-native-firebase/auth';
import {useKeyboard} from '../../../../../hooks/useKeyboard';

const UpdatePassword = ({close}) => {
  const [passwordCurrent, setPasswordCurrent] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const [keyboardHeight] = useKeyboard();

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
                [
                  {
                    text: 'Continuar',
                    onPress: () => {
                      setNewPassword('');
                      setNewPasswordConfirm('');
                      setPasswordCurrent('');
                      setLoading(false);
                      close(false);
                    },
                    style: 'cancel',
                  },
                ],
                {cancelable: true},
              );
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
      <View opacity={0.0} style={ApplicationStyles.separatorLineMini} />

      <Image
        source={Images.password}
        style={{
          width: 50,
          height: 50,
          resizeMode: 'contain',
          alignSelf: 'center',
          marginBottom: 10,
          tintColor: Colors.expert.primaryColor,
        }}
      />
      <Text style={Fonts.style.bold(Colors.dark, Fonts.size.h6, 'center')}>
        {'Actualizar contraseña'}
      </Text>

      <Text style={Fonts.style.light(Colors.data, Fonts.size.small, 'center')}>
        {'Confirma tu contraseña acutal e ingresa una nueva'}
      </Text>
      <View opacity={0.0} style={ApplicationStyles.separatorLineMini} />
      <View style={{width: '90%', alignSelf: 'center', marginBottom: 20}}>
        <MyTextInput
          pHolder={'Contraseña actual'}
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
        <View style={{height: keyboardHeight}} />
      </View>

      <TouchableOpacity
        onPress={() => updateProfile()}
        style={[
          styles.btnContainer,
          {
            backgroundColor: Colors.expert.primaryColor,
          },
        ]}>
        <Text
          style={Fonts.style.bold(Colors.light, Fonts.size.medium, 'center')}>
          {!loading ? 'Actualizar' : <ActivityIndicator color={Colors.light} />}
        </Text>
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
    flex: 0,
    height: 40,
    width: Metrics.contentWidth,
    alignSelf: 'center',
    borderRadius: Metrics.borderRadius,
    marginVertical: 20,

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
  },
});

export default UpdatePassword;
