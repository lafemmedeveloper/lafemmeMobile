import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';

import {Colors, Images, Fonts} from '../../Themes';

import MyTextInput from '../../Components/MyTextInput';

import styles from './styles';

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  getPhoneNumber(text) {
    var cleaned = ('' + text).replace(/\D/g, '');
    var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      var intlCode = match[1] ? '+1 ' : '',
        number = [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join(
          '',
        );

      return number;
    }
  }
  render() {
    const {loading, navigation, user} = this.props;
    const {userEmail, userPassword, userFirstName, userLastName} = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text
            style={Fonts.style.regular(Colors.dark, Fonts.size.h6, 'center')}>
            {'Perfil'}
          </Text>
        </View>
        <View style={styles.separatorLine} />
        <View style={styles.profileContainer}>
          <Text
            style={Fonts.style.regular(Colors.dark, Fonts.size.h6, 'center')}>
            {`${user.firstName} ${user.lastName}`}
          </Text>
          <Text
            style={Fonts.style.regular(Colors.dark, Fonts.size.h6, 'center')}>
            {this.getPhoneNumber('133106873181')}
          </Text>
        </View>

        {loading && <View style={styles.loading} />}
      </View>
    );
  }
}
