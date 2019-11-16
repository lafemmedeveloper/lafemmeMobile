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
import firestore from '@react-native-firebase/firestore';
import {Colors, Images, Fonts, ApplicationStyles} from '../../Themes';
import auth from '@react-native-firebase/auth';
import MyTextInput from '../../Components/MyTextInput';
import CardItemAddress from '../../Components/CardItemAddress';
import FieldCartConfig from '../../Components/FieldCartConfig';
import styles from './styles';
import {ScrollView} from 'react-native-gesture-handler';

import {validateCoverage} from '../../Helpers/GeoHelper';

import {msToDate, msToDay, msToHour} from '../../Helpers/MomentHelper';
export default class Address extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {}

  checkCoverage() {
    const {coverageZones} = this.props;
    validateCoverage(6.1367078, -75.6324356, coverageZones);
  }

  render() {
    const {user} = this.props;
    console.log('user:', user);
    return (
      <View style={styles.container}>
        <ScrollView style={styles.contentContainer}>
          <View style={styles.headerContainer}>
            <View opacity={0.0} style={ApplicationStyles.separatorLine} />
            <Text
              style={Fonts.style.bold(Colors.dark, Fonts.size.h6, 'center')}>
              {'Mis direcciones'}
            </Text>
            <View opacity={0.0} style={ApplicationStyles.separatorLine} />
          </View>

          {user &&
            user.address &&
            user.address.map((item, index) => {
              console.log('item:card', item);
              return <CardItemAddress key={index} data={item} />;
            })}
          <TouchableOpacity
            onPress={() => {
              this.props.closeModal();
            }}
            style={styles.productContainer}>
            <Text
              style={Fonts.style.bold(
                Colors.client.primartColor,
                Fonts.size.medium,
                'center',
              )}>
              {'+ Agregar direccion'}
            </Text>
          </TouchableOpacity>
          <View opacity={0.0} style={ApplicationStyles.separatorLine} />

          <View opacity={0.0} style={ApplicationStyles.separatorLine} />

          <TouchableOpacity
            onPress={() => {
              this.checkCoverage();
            }}>
            <Text>getCoverage</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }
}
