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
import MyTextInput from '../../../Components/MyTextInput';
import Loading from '../../../Components/Loading';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

import styles from '../styles';

export default class NameModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: '',
      userNameLast: '',
    };
  }
  //Actualizar nombre
  async updateProfile() {
    const {userName, userNameLast} = this.state;
    const {setLoading, user} = this.props;
    setLoading(true);
    if (userName === '' && userNameLast === '') {
      Alert.alert('Ups...', 'Completa o verifica los datos para continuar');
    } else {
      try {
        const currentUser = auth().currentUser;
        currentUser.updateProfile({
          displayName: `${userName} ${userNameLast}`,
        });
        const {uid} = currentUser;

        await firestore()
          .collection('users')
          .doc(uid)
          .update({
            firstName: userName,
            lastName: userNameLast,
          });
        this.setState({userName: '', userNameLast: ''});

        Alert.alert('Que bien', 'usuario Actualizado satisfatoriamente');
        setLoading(false);
      } catch (error) {
        Alert.alert('Ups....', 'Algo salio mal');
        setLoading(false);
        console.log(error);
      }
    }
  }

  render() {
    const {loading, user} = this.props;
    const {userName, userNameLast} = this.state;
    const {firstName, lastName} = user;

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
              name={'user'}
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
              {'Actualiza tu nombre'}
            </Text>

            <MyTextInput
              pHolder={firstName}
              text={userName}
              onChangeText={text => this.setState({userName: text})}
              secureText={false}
              textContent={'emailAddress'}
              autoCapitalize={'words'}
            />
            <MyTextInput
              pHolder={lastName}
              text={userNameLast}
              onChangeText={text => this.setState({userNameLast: text})}
              secureText={false}
              textContent={'emailAddress'}
              autoCapitalize={'words'}
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
