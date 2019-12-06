import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import {Colors, Images, Fonts} from '../../Themes';
import auth from '@react-native-firebase/auth';
import MyTextInput from '../../Components/MyTextInput';

import styles from './styles';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userEmail: '',
      userPassword: '',
    };
  }

  async componentDidMount() {}

  async handleLogin() {
    const {userEmail, userPassword} = this.state;
    // const {user, navigation} = this.props;

    if (userEmail !== '' && userPassword !== '') {
      try {
        if (userEmail !== '' && userPassword !== '') {
          this.setState({isLoading: true});
          const user = await auth().signInWithEmailAndPassword(
            userEmail,
            userPassword,
          );

          console.log('handleLogin', user);
          // console.log(user);

          // await this.props.setAuth(auth);
          // await this.props.setAccount();

          // this.setState({isLoading: false});
          // this.props.navigation.navigate('CompleteUserData');
        }
      } catch (error) {
        console.log('error', error.message);

        Alert.alert('Ups...', 'Verifica los datos ingresados');
      }
    } else {
      Alert.alert('Ups...', 'Completa o verifica los datos para continuar');
    }
  }

  async setDefaultUser() {
    this.setState({
      userEmail: 'j@jb.com',
      userPassword: 'qwerty',
    });
  }

  async setDefaultExpert() {
    this.setState({
      userEmail: 'expert@jb.com',
      userPassword: 'qwerty',
    });
  }
  render() {
    const {loading, navigation, isLogin} = this.props;
    const {userEmail, userPassword} = this.state;
    return (
      <View style={styles.container}>
        <KeyboardAvoidingView
          style={styles.containerItems}
          behavior="padding"
          enabled>
          {/* <View style={styles.headerContainer}>
            <Text
              style={Fonts.style.bold(
                Colors.light,
                Fonts.size.medium,
                'center',
              )}>
              {'WELCOME TO THE'}
            </Text>

            <Image source={Images.welcome} style={styles.logo} />
            <Text
              style={Fonts.style.regular(
                Colors.light,
                Fonts.size.small,
                'center',
              )}>
              {'by Johnatan Botero'}
            </Text>
          </View>
           */}
          <View style={styles.contentContainer}>
            <Text
              style={Fonts.style.regular(Colors.dark, Fonts.size.h6, 'center')}>
              {'Iniciar Sesion'}
            </Text>
            {__DEV__ && (
              <>
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
                    set Default User
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
              </>
            )}
            <MyTextInput
              pHolder={'Email'}
              text={userEmail}
              onChangeText={text => this.setState({userEmail: text})}
              secureText={false}
              textContent={'emailAddress'}
              autoCapitalize={'none'}
            />
            <MyTextInput
              pHolder={'Password'}
              text={userPassword}
              onChangeText={text => this.setState({userPassword: text})}
              secureText={true}
              textContent={'password'}
              autoCapitalize={'none'}
            />
            <TouchableOpacity
              onPress={() => {
                // navigation.navigate('Home', {});
                this.handleLogin();
              }}
              style={styles.btnContainer}>
              <Text
                style={Fonts.style.bold(
                  Colors.light,
                  Fonts.size.medium,
                  'center',
                )}>
                {'Login'}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.footerContainer}>
            <TouchableOpacity
              onPress={() => {
                isLogin();
                // navigation.navigate('Register', {});
              }}
              style={styles.btnRegisterLogin}>
              <Text
                style={Fonts.style.bold(
                  Colors.dark,
                  Fonts.size.medium,
                  'right',
                )}>
                {'Create an Account'}
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>

        {loading && <View style={styles.loading} />}
      </View>
    );
  }
}
