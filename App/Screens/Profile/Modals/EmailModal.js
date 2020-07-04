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

export default class EmailModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userEmail: '',
      currentPassword: '',
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

  //Update user dataBase
  async updateDataProfile() {
    try {
      const currentUser = auth().currentUser;
      const {uid} = currentUser;
      await firestore()
        .collection('users')
        .doc(uid)
        .update({
          email: this.state.userEmail,
        });
      this.setState({
        userEmail: '',
        currentPassword: '',
      });
    } catch (error) {
      console.log(error);
      Alert.alert('Ups...', 'Algo salio mal');
    }
  }
  //Actualizar email
  async updateProfile(currentPassword, userEmail) {
    const {setLoading} = this.props;

    setLoading(true);
    if (userEmail === '' && currentPassword === '') {
      Alert.alert('Ups...', 'Completa o verifica los datos para continuar');
    } else {
      this.reauthenticate(this.state.currentPassword)
        .then(() => {
          const currentUser = auth().currentUser;
          currentUser
            .updateEmail(this.state.userEmail)
            .then(() => {
              Alert.alert(
                'Que bien....',
                'Correo actualizado satisfactoriamente',
              );
              this.updateDataProfile();
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
    const {loading, user} = this.props;
    const {userEmail, currentPassword} = this.state;
    const {email} = user;

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
              name={'envelope'}
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
              textContent={'emailAddress'}
              autoCapitalize={'none'}
            />

            <MyTextInput
              pHolder={email}
              text={userEmail}
              onChangeText={text => this.setState({userEmail: text})}
              secureText={false}
              textContent={'emailAddress'}
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
