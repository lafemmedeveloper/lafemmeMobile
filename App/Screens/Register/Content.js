import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import {Colors, Images, Fonts} from '../../Themes';

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
    };
  }

  render() {
    const {loading, navigation, isLogin} = this.props;
    const {userEmail, userPassword, userFirstName, userLastName} = this.state;
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
          </View> */}
          <View style={styles.contentContainer}>
            <Text
              style={Fonts.style.regular(Colors.dark, Fonts.size.h6, 'center')}>
              {'Create an Accoun'}
            </Text>
            <MyTextInput
              pHolder={'Nombre'}
              text={userFirstName}
              onChangeText={text => this.setState({userFirstName: text})}
              secureText={false}
              textContent={'name'}
              autoCapitalize={'words'}
            />
            <MyTextInput
              pHolder={'Apellido'}
              text={userLastName}
              onChangeText={text => this.setState({userLastName: text})}
              secureText={false}
              textContent={'familyName'}
              autoCapitalize={'words'}
            />
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
                navigation.navigate('Home', {});
                // this.props.getPlaces('whas');
              }}
              style={styles.btnContainer}>
              <Text
                style={Fonts.style.bold(
                  Colors.light,
                  Fonts.size.medium,
                  'center',
                )}>
                {'Create Accoun'}
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
                {'Sign In'}
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>

        {loading && <View style={styles.loading} />}
      </View>
    );
  }
}
