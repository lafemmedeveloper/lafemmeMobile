import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import {Colors, Images, Fonts} from '../../Themes';
import auth from '@react-native-firebase/auth';

import MyTextInput from '../../Components/MyTextInput';

import styles from './styles';

export default class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userEmail: '',
      userPassword: '',
      userFirstName: '',
      userLastName: '',
      userPhone: '',
    };
  }

  async setDataRegister() {
    const {
      userEmail,
      userPassword,
      userFirstName,
      userLastName,
      userPhone,
    } = this.state;
    const {setLoading, setTempRegister} = this.props;

    if (
      userEmail !== '' &&
      userPassword !== '' &&
      userFirstName !== '' &&
      userLastName !== ''
    ) {
      // setLoading(true);
      await setTempRegister(this.state);
      this.handleSignUp();
    } else {
      Alert.alert('Ups...', 'Completa todos los datos del registro');
    }
  }

  async handleSignUp() {
    const {userEmail, userPassword} = this.state;
    const {setLoading} = this.props;

    console.log('handleSignUp', userEmail, userPassword);
    if (userEmail !== '' && userPassword !== '') {
      try {
        setLoading(true);
        auth()
          .createUserWithEmailAndPassword(userEmail, userPassword)
          .catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;

            console.log('errorCode', errorCode);
            console.log('errorMessage', errorMessage);

            if (
              error
                .toString()
                .includes(
                  'The email address is already in use by another account.',
                )
            ) {
              Alert.alert('Error de Autentificación', 'authError');
            } else {
              Alert.alert(
                'Ups...',
                'Tuvimos un problema procesando tu solicitud, por favor intentalo de nuevo',
              );
            }
          });

        setLoading(false);
        // await this.props.setAuth(authResponse);
      } catch (error) {
        console.log('error:register', error);
        setLoading(false);
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
      Alert.alert(
        'Ups...',
        'Tuvimos un problema, revisa los datos ingresados e intenta de nuevo.',
      );
    }
  }

  render() {
    const {loading, navigation, isLogin} = this.props;
    const {
      userEmail,
      userPassword,
      userFirstName,
      userPhone,
      userLastName,
    } = this.state;
    return (
      <View style={styles.container}>
        <KeyboardAvoidingView
          style={styles.containerItems}
          behavior="padding"
          enabled>
          <View style={styles.contentContainer}>
            <Image style={{marginVertical: 20}} source={Images.logoLafemme} />
            <Text
              style={Fonts.style.regular(Colors.dark, Fonts.size.h6, 'center')}>
              {'Crea tu cuenta'}
            </Text>
            <MyTextInput
              pHolder={'Nombre'}
              keyboardType={'default'}
              text={userFirstName}
              onChangeText={text => this.setState({userFirstName: text})}
              secureText={false}
              textContent={'name'}
              autoCapitalize={'words'}
            />
            <MyTextInput
              pHolder={'Apellidos'}
              text={userLastName}
              keyboardType={'default'}
              onChangeText={text => this.setState({userLastName: text})}
              secureText={false}
              textContent={'familyName'}
              autoCapitalize={'words'}
            />
            <MyTextInput
              pHolder={'Correo electrónico'}
              keyboardType={'email-address'}
              text={userEmail}
              onChangeText={text => this.setState({userEmail: text})}
              secureText={false}
              textContent={'emailAddress'}
              autoCapitalize={'none'}
            />
            <MyTextInput
              pHolder={'*Numero Celular (Opcional)'}
              keyboardType={'phone-pad'}
              text={userPhone}
              onChangeText={text => this.setState({userPhone: text})}
              secureText={false}
              textContent={'none'}
              autoCapitalize={'none'}
            />

            <MyTextInput
              pHolder={'Contraseña'}
              text={userPassword}
              keyboardType={'default'}
              onChangeText={text => this.setState({userPassword: text})}
              secureText={true}
              textContent={'password'}
              autoCapitalize={'none'}
            />
            <TouchableOpacity style={{marginVertical: 30}}>
              <Text
                style={Fonts.style.regular(
                  Colors.dark,
                  Fonts.size.small,
                  'center',
                )}>
                {'Al crear una cuenta acepto los'}{' '}
                <Text
                  style={Fonts.style.underline(
                    Colors.client.primaryColor,
                    Fonts.size.small,
                    'center',
                  )}>
                  {'Términos y Condiciones'}
                </Text>{' '}
                {'de La Femme'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.setDataRegister();
                // navigation.navigate('Home', {});
                // this.props.getPlaces('whas');
              }}
              style={styles.btnContainer}>
              <Text
                style={Fonts.style.bold(
                  Colors.light,
                  Fonts.size.medium,
                  'center',
                )}>
                {'Crear cuenta'}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.footerContainer}>
            <TouchableOpacity
              onPress={() => {
                isLogin();
                // navigation.navigate('Login', {});
              }}
              style={styles.btnRegisterLogin}>
              <Text
                style={Fonts.style.bold(
                  Colors.dark,
                  Fonts.size.medium,
                  'right',
                )}>
                {'Iniciar sesión'}
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>

        {loading && <View style={styles.loading} />}
      </View>
    );
  }
}
