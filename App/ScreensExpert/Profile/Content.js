/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  TouchableOpacity,
  Keyboard,
} from 'react-native';

import _ from 'lodash';

import {
  Colors,
  Fonts,
  Images,
  Metrics,
  ApplicationStyles,
  FlatList,
} from '../../Themes';
import auth from '@react-native-firebase/auth';
import styles from './styles';
import {getExpertHistoryOrders} from '../../Core/Services/Actions';
import MyTextInput from '../../Components/MyTextInput';
import moment from 'moment';
import DatePicker from 'react-native-datepicker';
import AppConfig from '../../Config/AppConfig';

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: this.props.auth.email ? this.props.auth.email : '',
      firstName: this.props.user.firstName ? this.props.user.firstName : '',
      lastName: this.props.user.lastName ? this.props.user.lastName : '',
      birthday: this.props.user.birthday ? this.props.user.birthday : null,
      gender: this.props.user.gender,
    };
  }

  async updateProfile() {
    const {auth, user, updateProfile, navigation} = this.props;
    console.log('updateProfile');
    const {
      email,
      firstName,
      lastName,
      birthday,
      selectedPleasures,
      gender,
      genderFilter,
      relationStatus,
    } = this.state;

    console.log(
      'if',
      email !== null &&
        email !== '' &&
        firstName !== '' &&
        lastName !== '' &&
        birthday != null &&
        relationStatus != null &&
        gender != null &&
        genderFilter != null &&
        selectedPleasures.length > 0,
    );

    if (
      email !== null &&
      email !== '' &&
      firstName !== '' &&
      lastName !== '' &&
      birthday != null &&
      relationStatus != null &&
      gender != null &&
      genderFilter != null &&
      selectedPleasures.length > 0
    ) {
      const data = {
        uid: auth.uid,
        email,
        firstName,
        lastName,
        birthday,

        gender,
      };

      console.log('updateProfile:data', data);

      try {
        console.log('try');
        await updateProfile({...user.profile, ...data}, 'profile');
        // navigation.navigate('Home');
      } catch (error) {
        console.log('error', error);
      }
    } else {
      Alert.alert('Ups...', 'Completa todos los datos para continuar.');
    }
  }

  render() {
    const {
      user,
      expertActiveOrders,
      navigation,
      expertHistoryOrders,
      appType,
    } = this.props;

    const {email, firstName, lastName, birthday, gender} = this.state;
    console.log('expertActiveOrders', expertActiveOrders);
    return (
      <View style={styles.container}>
        <ScrollView
          style={{
            fielx: 1,
            width: Metrics.screenWidth,
            height: '100%',
            marginTop: 60 + Metrics.addHeader,
          }}>
          <KeyboardAvoidingView
            style={styles.containerItems}
            behavior="padding"
            enabled>
            <View style={styles.contentContainer}>
              <Text>Completar perfil</Text>
              <View style={{width: '100%'}}>
                <Text
                  style={[
                    Fonts.style.regular(Colors.Gray, Fonts.size.tiny, 'left'),
                  ]}>
                  {' Correo electrónico'}
                </Text>
                <MyTextInput
                  pHolder={'Correo electrónico'}
                  text={email}
                  editable={this.props.auth.email !== null}
                  onChangeText={text => this.setState({email: text})}
                  secureText={false}
                  textContent={'emailAddress'}
                  autoCapitalize={'none'}
                />
              </View>
              <View style={{width: '100%'}}>
                <Text
                  style={[
                    Fonts.style.regular(Colors.Gray, Fonts.size.tiny, 'left'),
                  ]}>
                  {' Nombre'}
                </Text>
                <MyTextInput
                  pHolder={'Nombre'}
                  text={firstName}
                  onChangeText={text => this.setState({firstName: text})}
                  secureText={false}
                  textContent={'name'}
                  autoCapitalize={'words'}
                />
              </View>
              <View style={{width: '100%'}}>
                <Text
                  style={[
                    Fonts.style.regular(Colors.Gray, Fonts.size.tiny, 'left'),
                  ]}>
                  {' Apellido'}
                </Text>
                <MyTextInput
                  pHolder={'Apellido'}
                  text={lastName}
                  onChangeText={text => this.setState({lastName: text})}
                  secureText={false}
                  textContent={'name'}
                  autoCapitalize={'words'}
                />
              </View>
              <View style={{width: '100%'}}>
                <Text
                  style={[
                    Fonts.style.regular(Colors.Gray, Fonts.size.tiny, 'left'),
                  ]}>
                  {' Fecha de nacimiento'}
                </Text>

                <MyTextInput
                  pHolder={'Fecha de nacimiento'}
                  text={birthday !== null ? moment(birthday).format('LL') : ''}
                  onChangeText={text => this.setState({birthday: text})}
                  secureText={false}
                  editable={false}
                  // textContent={'name'}
                  // autoCapitalize={'words'}
                />
                {/* <View
                style={{
                  width: '100%',
                  position: 'absolute',
                  height: 40,
                  // backgroundColor: 'red',
                }}
              /> */}
                <DatePicker
                  style={{
                    width: Metrics.screenWidth * 0.8,
                    position: 'absolute',
                    backgroundColor: 'transparent',
                    // position: 'absulte',
                  }}
                  date={birthday}
                  mode={'date'}
                  placeholder={'Fecha de nacimiento'}
                  placeholderTextColor={Colors.Gray}
                  format={'YYYY-MM-DD'}
                  maxDate={moment(new Date()).format('YYYY-MM-DD')}
                  confirmBtnText={'Confirmar'}
                  cancelBtnText={'Cancelar'}
                  showIcon={false}
                  customStyles={{
                    dateIcon: {
                      position: 'absolute',
                      left: 0,
                      width: 0,
                      height: 0,
                      marginLeft: 0,
                    },
                    placeholderText: {
                      fontFamily: Fonts.type.regular,
                      // color: Colors.Gray,
                      // height: ,
                      color: 'transparent',
                      fontSize: Fonts.size.TextInput,
                      textAlignVertical: 'center',
                      textAlign: 'left',
                    },
                    _dateText: {
                      color: 'red',
                    },
                    dateInput: {
                      justifyContent: 'center',
                      alignItems: 'flex-start',
                      borderColor: 'transparent',
                      height: 40,
                      width: Metrics.screenWidth * 0.8,
                      flex: 1,
                      color: 'transparent',
                    },
                    dateText: {
                      fontFamily: Fonts.type.regular,
                      // color: Colors.OruxDark,
                      // height: 38,
                      fontSize: Fonts.size.TextInput,
                      textAlignVertical: 'center',
                      textAlign: 'left',
                      color: 'transparent',
                    },
                  }}
                  onDateChange={date => {
                    this.setState({birthday: date});
                  }}
                />
              </View>
              <View style={{width: '100%'}}>
                <Text
                  style={[
                    Fonts.style.regular(Colors.Gray, Fonts.size.tiny, 'left'),
                  ]}>
                  {'Eres'}
                </Text>
                <View
                  style={{
                    width: Metrics.contentWidth,
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    marginBottom: 20,
                    marginTop: 5,
                  }}>
                  {user &&
                    AppConfig.gender &&
                    AppConfig.gender.map((item, index) => {
                      console.log(
                        'gender',
                        AppConfig.gender[this.state.gender] === item,
                        this.state.gender,
                        AppConfig.gender[this.state.gender],
                        index,
                      );
                      return (
                        <TouchableOpacity
                          key={index}
                          onPress={() => {
                            this.setState({gender: index}, () => {
                              console.log('gender', this.state.gender);
                            });
                            // this.filterPleasures(item.id, selectedPleasures);
                          }}
                          style={{
                            paddingHorizontal: 10,
                            marginRight: 10,
                            marginVertical: 2.5,
                            paddingVertical: 5,
                            borderRadius: 50,
                            // paddingHorizontal: 5,
                            // marginHorizontal: 5,
                            // marginVertical: 2.5,

                            backgroundColor:
                              this.state.gender === index
                                ? Colors.primaryColor
                                : 'transparent',
                            borderColor: Colors.accentColors,
                            borderWidth: 1,
                          }}>
                          <Text
                            style={Fonts.style.light(
                              Colors.dark,
                              Fonts.size.small,
                              'center',
                            )}>
                            {item}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                </View>
              </View>

              <TouchableOpacity
                onPress={() => {
                  // navigation.navigate('Home', {});
                  Keyboard.dismiss();
                  this.updateProfile();
                }}
                style={[
                  styles.btnContainer,
                  {
                    backgroundColor: Colors.secondaryColor,
                  },
                ]}>
                <Text
                  style={Fonts.style.light(
                    Colors.light,
                    Fonts.size.medium,
                    'center',
                  )}>
                  {'Completar perfil'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[]}
                onPress={() => {
                  navigation.navigate('Home');
                }}>
                <Text
                  style={[
                    Fonts.style.underline,
                    Fonts.style.regular(
                      Colors.dark,
                      Fonts.size.small,
                      'center',
                    ),
                  ]}>
                  Completar mas adelante
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[]}
                onPress={() => {
                  this.props.logOut();
                  this.props.navigation.navigate('Loading');
                }}>
                <Text
                  style={[
                    Fonts.style.underline,
                    Fonts.style.regular(
                      Colors.dark,
                      Fonts.size.small,
                      'center',
                    ),
                  ]}>
                  logOut
                </Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
          <View style={{height: Metrics.footerMenu}}></View>
        </ScrollView>
      </View>
    );
  }
}
