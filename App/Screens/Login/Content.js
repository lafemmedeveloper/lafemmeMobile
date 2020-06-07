import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
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

  async componentDidMount() {
    //     const {deviceInfo} = this.props;
    // //
    // console.log('_deviceInfo', this.props);
  }

  async handleLogin() {
    const {userEmail, userPassword} = this.state;
    const {setLoading, setAccount} = this.props;
    setLoading(true);
    if (userEmail !== '' && userPassword !== '') {
      try {
        if (userEmail !== '' && userPassword !== '') {
          const user = await auth().signInWithEmailAndPassword(
            userEmail,
            userPassword,
          );

          console.log('handleLogin', user);

          await setAccount(auth().currentUser.uid);
          setLoading(false);
          // console.log(user);

          // await this.props.setAuth(auth);

          // this.setState({isLoading: false});
          // this.props.navigation.navigate('CompleteUserData');
        }
      } catch (error) {
        console.log('error', error.message);
        setLoading(false);
        Alert.alert('Ups...', 'Verifica los datos ingresados');
      }
    } else {
      setLoading(false);
      Alert.alert('Ups...', 'Completa o verifica los datos para continuar');
    }
  }

  async setDefaultUser() {
    this.setState({
      userEmail: 'j@jb.com',
      userPassword: 'qwerty!',
    });
  }

  async setDefaultExpert() {
    this.setState({
      userEmail: 'expert@jb.com',
      userPassword: 'qwerty',
    });
  }
  render() {
    const {loading, navigation, isLogin, appType, deviceInfo} = this.props;

    const {userEmail, userPassword} = this.state;
    return (
      <View style={styles.container}>
        <KeyboardAvoidingView
          style={styles.containerItems}
          behavior="padding"
          enabled>
          <View style={styles.contentContainer}>
            <Image
              style={{width: 100, height: 100, resizeMode: 'contain'}}
              source={Images.logoLafemme}
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
        </KeyboardAvoidingView>
        {__DEV__ && (
          <View
            style={{
              opacity: 0.2,
              position: 'absolute',
              flexDirection: 'row',

              bottom: 30,
            }}>
            <TouchableOpacity
              onPress={() => {
                this.setDefaultUser();
              }}>
              <Text
                style={Fonts.style.regular(
                  Colors.dark,
                  Fonts.size.small,
                  'center',
                )}>
                set Default Client
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.setDefaultExpert();
              }}>
              <Text
                style={Fonts.style.regular(
                  Colors.dark,
                  Fonts.size.small,
                  'center',
                )}>
                set Default Expert
              </Text>
            </TouchableOpacity>
          </View>
        )}
        {loading && <Loading type={'client'} loading={loading} />}
      </View>
    );
  }
}
