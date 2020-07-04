import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import {Colors, Images, Fonts} from '../../Themes';
import auth from '@react-native-firebase/auth';
import MyTextInput from '../../Components/MyTextInput';

import styles from './styles';
import Loading from '../../Components/Loading';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userEmail: '',
      userPassword: '',
    };
  }

  async handleLogin() {
    const {userEmail, userPassword} = this.state;
    const {setLoading, setAccount} = this.props;
    setLoading(true);

    if (userEmail === '' && userPassword === '') {
      setLoading(false);
      Alert.alert('Ups...', 'Completa o verifica los datos para continuar');
    } else {
      try {
        if (userEmail !== '' && userPassword !== '') {
          await auth().signInWithEmailAndPassword(userEmail, userPassword);

          await setAccount(auth().currentUser.uid);
          setLoading(false);
        }
      } catch (error) {
        console.log('error', error.message);
        setLoading(false);
        if (
          error
            .toString()
            .includes(
              'password is invalid or the user does not have a password.',
            )
        ) {
          Alert.alert(
            'Error de Autentificación',
            'Tu contraseña es incorrecta',
          );
        } else if (
          error.toString().includes('email address is badly formatted.')
        ) {
          Alert.alert(
            'Error de Autentificación',
            'Revisa tu correo o contraseña',
          );
        } else if (
          error
            .toString()
            .includes(
              'is no user record corresponding to this identifier. The user may have been deleted.',
            )
        ) {
          Alert.alert(
            'Error de Autentificación',
            'No hay registro de usuario correspondiente a este identificador. El usuario puede haber sido eliminado.',
          );
        }
      }
    }
  }

  render() {
    const {loading, isLogin, appType} = this.props;

    const {userEmail, userPassword} = this.state;

    return (
      <View style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : null}
          enabled>
          <View style={styles.contentContainer}>
            <Image
              style={{width: 100, height: 100, resizeMode: 'contain'}}
              source={
                appType === 'client' ? Images.logoLafemme : Images.logoExpert
              }
            />

            <Text
              style={[
                Fonts.style.regular(Colors.dark, Fonts.size.h6, 'center'),
                {marginVertical: 20},
              ]}>
              {'Iniciar Sesión'}
            </Text>

            <MyTextInput
              pHolder={'Correo electrónico'}
              text={userEmail}
              onChangeText={text => this.setState({userEmail: text})}
              secureText={false}
              textContent={'emailAddress'}
              autoCapitalize={'none'}
            />
            <MyTextInput
              pHolder={'Contraseña'}
              text={userPassword}
              onChangeText={text => this.setState({userPassword: text})}
              secureText={true}
              textContent={'password'}
              autoCapitalize={'none'}
            />
            <TouchableOpacity
              onPress={() => {
                this.handleLogin();
              }}
              style={[
                styles.btnContainer,
                {
                  backgroundColor:
                    appType === 'client'
                      ? Colors.client.secondaryColor
                      : Colors.expert.secondaryColor,
                },
              ]}>
              <Text
                style={Fonts.style.bold(
                  Colors.light,
                  Fonts.size.medium,
                  'center',
                )}>
                {'Iniciar sesión'}
              </Text>
            </TouchableOpacity>
          </View>
          {appType === 'client' && (
            <View>
              <Text
                style={[
                  Fonts.style.regular(Colors.dark, Fonts.size.medium, 'center'),
                  {marginVertical: 10},
                ]}>
                {'O continúa con:'}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  this.handleLogin();
                }}
                style={[styles.btnSocialContainer]}>
                <Image
                  source={{uri: Images.fbIcon}}
                  style={{width: 25, height: 25, marginRight: 10}}
                />
                <Text
                  style={Fonts.style.semiBold(
                    Colors.dark,
                    Fonts.size.small,
                    'center',
                  )}>
                  {'Continuar con Facebook'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  this.handleLogin();
                }}
                style={[styles.btnSocialContainer]}>
                <Image
                  source={{uri: Images.gIcon}}
                  style={{width: 25, height: 25, marginRight: 10}}
                />
                <Text
                  style={Fonts.style.semiBold(
                    Colors.dark,
                    Fonts.size.small,
                    'center',
                  )}>
                  {'Continuar con Google'}
                </Text>
              </TouchableOpacity>
              <View style={styles.footerContainer}>
                <TouchableOpacity
                  onPress={() => {
                    isLogin();
                  }}
                  style={styles.btnRegisterLogin}>
                  <Text
                    style={Fonts.style.bold(
                      Colors.dark,
                      Fonts.size.medium,
                      'right',
                    )}>
                    {'Crear cuenta'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </KeyboardAvoidingView>

        {loading && <Loading type={'client'} loading={loading} />}
      </View>
    );
  }
}
