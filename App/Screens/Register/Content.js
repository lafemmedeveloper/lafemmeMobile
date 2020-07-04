import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';

import {Colors, Images, Fonts, Metrics} from '../../Themes';

import auth from '@react-native-firebase/auth';
import WebView from 'react-native-webview';
import Modal from 'react-native-modal';

import MyTextInput from '../../Components/MyTextInput';
import styles from './styles';
import Loading from '../../Components/Loading';

export default class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userEmail: '',
      userPassword: '',
      userFirstName: '',
      userLastName: '',
      userPhone: '',
      tycModal: false,
    };
  }

  async setDataRegister() {
    const {userEmail, userPassword, userFirstName, userLastName} = this.state;
    const {setTempRegister, setLoading} = this.props;
    setLoading(true);

    if (
      userEmail !== '' &&
      userPassword !== '' &&
      userFirstName !== '' &&
      userLastName !== ''
    ) {
      await setTempRegister(this.state);
      this.handleSignUp();

      setLoading(false);
    } else {
      Alert.alert('Ups...', 'Completa todos los datos del registro');
      setLoading(false);
    }
  }

  async handleSignUp() {
    const {userEmail, userPassword} = this.state;
    const {setLoading} = this.props;
    setLoading(true);

    if (userEmail !== '' && userPassword !== '') {
      try {
        auth()
          .createUserWithEmailAndPassword(userEmail, userPassword)

          .catch(function(error) {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;

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
    const {loading, isLogin} = this.props;
    const {
      userEmail,
      userPassword,
      userFirstName,
      userPhone,
      userLastName,
    } = this.state;
    return (
      <View style={styles.container}>
        <ScrollView>
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
            <TouchableOpacity
              onPress={() => {
                this.setState({
                  tycModal: true,
                });
              }}
              style={{marginVertical: 30}}>
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
          <View style={[styles.footerContainer, {marginVertical: 10}]}>
            <TouchableOpacity
              onPress={() => {
                isLogin();
              }}
              style={styles.btnRegisterLogin}>
              <Text style={Fonts.style.bold(Colors.dark, Fonts.size.medium)}>
                {'Ye tengo cuenta'}
              </Text>
            </TouchableOpacity>
          </View>
          <Modal
            isVisible={this.state.tycModal}
            style={{
              justifyContent: 'flex-end',
              margin: 0,
            }}
            onBackdropPress={() => {
              this.setState({tycModal: false});
            }}
            backdropColor={Colors.pinkMask(0.75)}>
            <View
              style={{
                paddingTop: 40,
                height: Metrics.screenHeight * 0.8,
                justifyContent: 'flex-end',
                margin: 0,
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
                alignItems: 'center',
                backgroundColor: Colors.light,
              }}>
              <WebView
                WebView={true}
                source={{uri: 'https://www.weflow.me/terminosycondiciones'}}
                renderLoading={this.renderLoadingView}
                startInLoadingState={true}
                style={{
                  width: Metrics.screenWidth,
                  alignSelf: 'center',
                  flex: 1,
                }}
              />
            </View>
          </Modal>
        </ScrollView>
        {loading && <Loading type={'client'} loading={loading} />}
      </View>
    );
  }
}
