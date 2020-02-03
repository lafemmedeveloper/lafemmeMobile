import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
  Linking,
} from 'react-native';

import auth from '@react-native-firebase/auth';

import {Colors, Images, Fonts, Metrics} from '../../Themes';
import Icon from 'react-native-vector-icons/FontAwesome5';
import ItemProfile from '../../Components/ItemProfile';

import styles from './styles';
import Modal from 'react-native-modal';
import Login from '../Login/Content';
import Register from '../Register/Content';

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalAuth: false,
      isLogin: true,
    };
  }

  getPhoneNumber(text) {
    var cleaned = ('' + text).replace(/\D/g, '');
    var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      var intlCode = match[1] ? '+1 ' : '',
        number = [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join(
          '',
        );
      console.log('number', number);
      return text; //number;
    }
  }

  render() {
    const {
      loading,
      navigation,
      setLoading,
      deviceInfo,
      user,
      setAccount,
      appType,
      logOut,
      setTempRegister,
    } = this.props;
    const {isLogin, modalAuth} = this.state;

    if (!user) {
      return (
        <View style={styles.container}>
          <View style={styles.containerNoUSer}>
            <Text
              style={Fonts.style.semiBold(
                Colors.dark,
                Fonts.size.h6,
                'center',
              )}>
              {'Ups...'}
            </Text>
            <View style={{height: 20}} />
            <Text
              style={Fonts.style.regular(
                Colors.dark,
                Fonts.size.medium,
                'center',
              )}>
              {
                'No logramos identificarte, ingresa o crea una cuenta para ver esta sesión'
              }
            </Text>

            <TouchableOpacity
              onPress={() => {
                this.setState({modalAuth: true});
                // navigation.navigate('Home', {});
                // this.handleLogin();
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
                {'Ingresar'}
              </Text>
            </TouchableOpacity>
          </View>

          <Modal //auth
            isVisible={modalAuth && !user}
            onBackdropPress={() => {
              this.setState({modalAuth: false});
            }}
            // isVisible={user.uid == null}
            style={{
              justifyContent: 'flex-end',
              margin: 0,

              // ,height: Metrics.screenHeight * 0.7
              // top:100,
            }}
            backdropColor={Colors.pinkMask(0.75)}>
            <View
              style={{
                // flex: 0,
                height: Metrics.screenHeight * 0.8,
                justifyContent: 'flex-end',
                margin: 0,
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
                alignItems: 'center',
                backgroundColor: Colors.light,
              }}>
              {isLogin && (
                <Login
                  appType={appType}
                  deviceInfo={deviceInfo}
                  setLoading={val => {
                    setLoading(val);
                  }}
                  setAccount={val => {
                    setAccount(val);
                  }}
                  loading={loading}
                  goBack={() => {
                    this.setState({modalAuth: false});
                    navigation.navigate('Home');
                  }}
                  isLogin={() => this.setState({isLogin: false})}
                />
              )}
              {!isLogin && (
                <Register
                  appType={appType}
                  deviceInfo={deviceInfo}
                  setLoading={val => {
                    setLoading(val);
                  }}
                  setAccount={val => {
                    setAccount(val);
                  }}
                  setTempRegister={data => setTempRegister(data)}
                  loading={loading}
                  goBack={() => {
                    this.setState({modalAuth: false});
                    navigation.navigate('Home');
                  }}
                  isLogin={() => this.setState({isLogin: true})}
                />
              )}
            </View>
          </Modal>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text
            style={Fonts.style.semiBold(Colors.dark, Fonts.size.h6, 'center')}>
            {'Perfil y configuración'}
          </Text>
        </View>
        <View style={styles.separatorLine} />
        <ScrollView>
          <View //profile
            style={styles.profileContainer} //profile
          >
            <View style={styles.separator} />
            <Text
              style={Fonts.style.semiBold(
                Colors.dark,
                Fonts.size.h4,
                'center',
              )}>
              {`${user.firstName} ${user.lastName}`}
            </Text>
            <Text
              style={Fonts.style.regular(
                Colors.dark,
                Fonts.size.medium,
                'center',
              )}>
              +57 {user.phone}
              {/* {this.getPhoneNumber(user.phone)} */}
            </Text>
            <Text
              style={Fonts.style.regular(
                Colors.dark,
                Fonts.size.medium,
                'center',
              )}>
              {user.email}
            </Text>
            <TouchableOpacity>
              <Text
                style={Fonts.style.underline(
                  Colors.client.primaryColor,
                  Fonts.size.small,
                  'center',
                )}>
                {'Editar información'}
              </Text>
            </TouchableOpacity>
            <View style={styles.separator} />
          </View>
          <View //items
            style={styles.profileContainer}>
            <ItemProfile
              title={'Actualizar contraseña'}
              icon={'lock'}
              action={() => {
                console.log('dfghytf');
              }}
              decorationLine={true}
            />
            <ItemProfile
              title={'Invitar amigos'}
              icon={'paper-plane'}
              action={() => {
                console.log('dfghytf');
              }}
              decorationLine={true}
            />
            <ItemProfile
              title={'Mis direcciones'}
              icon={'map-marker'}
              action={() => {
                console.log('address');
              }}
              decorationLine={true}
            />
          </View>
          <View //Legals
            style={styles.profileContainer}>
            <ItemProfile
              title={'Califica tu experiencia'}
              icon={'star'}
              action={() => {
                console.log('dfghytf');
              }}
              decorationLine={true}
            />
            <ItemProfile
              title={'Condiciones del servicio'}
              icon={'check-square'}
              action={() => {
                console.log('dfghytf');
              }}
              decorationLine={true}
            />

            <ItemProfile
              title={'Ayuda'}
              icon={'question-circle'}
              action={() => {
                console.log('dfghytf');
              }}
              decorationLine={false}
            />
          </View>
          <View //logout
            style={styles.profileContainer}>
            <ItemProfile
              title={'Cerrar Sesión'}
              icon={'sign-out-alt'}
              action={() => {
                logOut();
              }}
              decorationLine={false}
            />
          </View>
          <View //About
            style={styles.profileContainer}>
            <View style={styles.separator} />
            <Text
              style={Fonts.style.regular(
                Colors.dark,
                Fonts.size.small,
                'center',
              )}>
              La Femme Clientes
            </Text>
            <Text
              style={Fonts.style.regular(
                Colors.dark,
                Fonts.size.small,
                'center',
              )}>
              {deviceInfo.readableVersion}
            </Text>
            <TouchableOpacity
              onPress={() => {
                Linking.openURL(
                  `whatsapp://send?text=Me interesa contactar al desarrollador de La Femme &phone=+573106873181`,
                );
              }}
              style={{marginVertical: 20}}>
              <Text
                style={Fonts.style.regular(
                  Colors.dark,
                  Fonts.size.tiny,
                  'center',
                )}>
                {'Desarrollado por'}
              </Text>
              <Text
                style={Fonts.style.bold(
                  Colors.dark,
                  Fonts.size.small,
                  'center',
                )}>
                {'@NiboStudio'}
              </Text>
            </TouchableOpacity>
            <View style={styles.separator} />
          </View>
        </ScrollView>

        {loading && <View style={styles.loading} />}
      </View>
    );
  }
}
