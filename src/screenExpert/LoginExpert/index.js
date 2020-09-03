import React, {useState, useContext} from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {Images, Colors, Fonts, Metrics} from '../../themes';
import MyTextInput from '../../components/MyTextInput';
import Loading from '../../components/Loading';
import {StoreContext} from '../../flux';
import {Login} from '../../flux/auth/actions';

const LoginExpert = () => {
  const {state, authDispatch} = useContext(StoreContext);
  const {auth} = state;
  const {loading} = auth;

  const [email, setEmail] = useState('eglis@gmail.com');
  const [password, setPassword] = useState('123456');

  const handleLogin = async () => {
    if (email === '' || password === '') {
      Alert.alert('Ups', 'Todos los campos son necesarios');
    } else {
      await Login(email, password, authDispatch);
    }
  };
  console.log('loading => login', loading);

  return (
    <>
      <Loading type={'expert'} loading={loading} />
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <Image
            style={{width: 100, height: 100, resizeMode: 'contain'}}
            source={Images.logoExpert}
          />

          <Text
            style={[
              Fonts.style.regular(Colors.dark, Fonts.size.h6, 'center'),
              {marginVertical: 20},
            ]}>
            {'Iniciar Sesión'}
            {loading && <ActivityIndicator />}
          </Text>

          <MyTextInput
            pHolder={'Correo electrónico'}
            text={email}
            onChangeText={(text) => setEmail(text)}
            secureText={false}
            textContent={'emailAddress'}
            autoCapitalize={'none'}
          />
          <MyTextInput
            pHolder={'Contraseña'}
            text={password}
            onChangeText={(text) => setPassword(text)}
            secureText={true}
            textContent={'password'}
            autoCapitalize={'none'}
          />
          <TouchableOpacity
            onPress={() => handleLogin()}
            style={[
              styles.btnContainer,
              {
                backgroundColor: Colors.expert.secondaryColor,
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
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: Metrics.screenWidth,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerItems: {
    flex: 1,
    paddingBottom: 10,
    alignItems: 'center',
  },

  loading: {
    position: 'absolute',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    width: Metrics.screenWidth,
    zIndex: 2000,
  },
  headerContainer: {
    flex: 0,
    width: Metrics.screenWidth,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    width: Metrics.screenWidth,
    paddingHorizontal: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerContainer: {
    flex: 0,
    flexDirection: 'row',
    width: Metrics.screenWidth,

    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  btnRegisterLogin: {
    flex: 0,
    width: Metrics.screenWidth / 2,
    height: 40,
    marginVertical: Metrics.addFooter * 2,
    justifyContent: 'center',
    alignItems: 'center',
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
  btnSocialContainer: {
    flexDirection: 'row',
    flex: 0,
    height: 40,
    width: Metrics.contentWidth,
    alignSelf: 'center',
    borderRadius: Metrics.borderRadius,
    marginVertical: 10,
    borderWidth: 0.5,
    borderColor: Colors.pinkMask(0.25),

    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoginExpert;
