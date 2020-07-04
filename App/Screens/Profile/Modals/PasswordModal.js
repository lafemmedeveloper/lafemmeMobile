import React, {Component} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';

import {Colors, Fonts} from '../../../Themes';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import MyTextInput from '../../../Components/MyTextInput';

import styles from '../styles';
import Loading from '../../../Components/Loading';

export default class PasswordModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    };
  }
  reauthenticate() {
    const currentUser = auth().currentUser;
    const cred = auth.EmailAuthProvider.credential(
      currentUser.email,
      this.state.currentPassword,
    );
    return currentUser.reauthenticateWithCredential(cred);
  }

  //Actualizar PASSWORD
  async updateProfile(currentPassword, newPassword) {
    const {setLoading} = this.props;

    setLoading(true);
    if (newPassword === '' && currentPassword === '' && confirmPassword) {
      Alert.alert('Ups...', 'Completa o verifica los datos para continuar');
    } else {
      this.reauthenticate(this.state.currentPassword)
        .then(() => {
          const currentUser = auth().currentUser;
          currentUser
            .updatePassword(this.state.newPassword)
            .then(() => {
              Alert.alert(
                'Que bien....',
                'Contraseña actualizado satisfactoriamente',
              );
              this.setState({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
              });
              setLoading(false);
            })
            .catch(error => {
              console.log(error);
              setLoading(false);
              Alert.alert('Ups...', 'Algo salio mal');
            });
        })
        .catch(error => {
          console.log(error);
          setLoading(false);
          Alert.alert('Ups...', 'Algo salio mal');
        });
    }
  }

  render() {
    const {loading} = this.props;
    const {newPassword, currentPassword, confirmPassword} = this.state;

    return (
      <View style={styles.container}>
        <KeyboardAvoidingView style={styles.containerItems} enabled>
          <View style={styles.contentContainer}>
            <Icon
              style={[
                {
                  color: Colors.client.secondaryColor,
                  fontSize: 30,
                  marginVertical: 10,
                },
              ]}
              name={'lock'}
            />
            <Text
              style={[
                Fonts.style.regular(Colors.dark, Fonts.size.h6, 'center'),
              ]}>
              {' Actualizar datos'}
            </Text>
            <Text
              style={Fonts.style.light(
                Colors.data,
                Fonts.size.small,
                'center',
              )}>
              {'Por seguridad ingresa tu contraseña'}
            </Text>

            <MyTextInput
              pHolder={'Actual contraseña'}
              text={currentPassword}
              onChangeText={text => this.setState({currentPassword: text})}
              secureText={true}
              autoCapitalize={'none'}
            />

            <MyTextInput
              pHolder={'Nueva contraseña'}
              text={newPassword}
              onChangeText={text => this.setState({newPassword: text})}
              secureText={true}
              autoCapitalize={'none'}
            />
            <MyTextInput
              pHolder={'Confirmar contraseña'}
              text={confirmPassword}
              onChangeText={text => this.setState({confirmPassword: text})}
              secureText={true}
              autoCapitalize={'none'}
            />

            <TouchableOpacity
              onPress={() => {
                this.updateProfile();
              }}
              style={[
                styles.btnContainer,
                {
                  backgroundColor: Colors.client.secondaryColor,

                  marginVertical: 30,
                },
              ]}>
              <Text
                style={Fonts.style.bold(
                  Colors.light,
                  Fonts.size.medium,
                  'center',
                )}>
                {'Actualizar'}
              </Text>
            </TouchableOpacity>
            {loading && <Loading type={'client'} loading={loading} />}
          </View>
        </KeyboardAvoidingView>
      </View>
    );
  }
}
