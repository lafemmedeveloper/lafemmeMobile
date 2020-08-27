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
import {Colors, Images, Fonts, ApplicationStyles, Metrics} from '../../Themes';
import auth from '@react-native-firebase/auth';
import MyTextInput from '../../Components/MyTextInput';
import CardItemAddress from '../../Components/CardItemAddress';
import FieldCartConfig from '../../Components/FieldCartConfig';
import styles from './styles';
import {ScrollView} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import Modal from 'react-native-modal';
import {validateCoverage} from '../../Helpers/GeoHelper';

import Loading from '../Loading';
import {msToDate, msToDay, msToHour} from '../../Helpers/MomentHelper';

export default class Address extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    // console.log('this.props', this.props);
  }

  async removeAddress(id) {
    const {user, updateProfile, setLoading} = this.props;

    let address = user.address;

    const index = address ? address.findIndex((i) => i.id === id) : -1;

    if (index !== -1) {
      address = [...address.slice(0, index), ...address.slice(index + 1)];

      setLoading(true);

      if (user.cart.address != null && user.cart.address.id === id) {
        await updateProfile({...user.cart, address: null}, 'cart');
      }

      await updateProfile(address, 'address');
      setLoading(false);
    }
  }

  async selectAddress(address) {
    const {user, updateProfile, setLoading, coverageZones} = this.props;

    const {latitude, longitude} = address.coordinates;

    console.log('address', address);

    console.log('address', latitude, longitude, coverageZones);
    let coverage = validateCoverage(latitude, longitude, coverageZones);

    if (coverage) {
      setLoading(true);
      await updateProfile({...user.cart, address}, 'cart');
      this.props.closeModal();
      setLoading(false);
    } else {
      Alert.alert(
        'Lo sentimos',
        'Ya no tenemos combertura en esta zona, selecciona otra dirección para continuar.',
      );
      setLoading(false);
    }
  }

  render() {
    const {user} = this.props;

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
              return (
                <CardItemAddress
                  key={item.id}
                  data={item}
                  selectAddress={() => {
                    this.selectAddress(item);
                  }}
                  removeAddress={(id) => {
                    Alert.alert(
                      'Alerta',
                      'Realmente desea eliminar esta dirección de tu lista.',
                      [
                        {
                          text: 'Eliminar',
                          onPress: () => {
                            console.log('DeleteAddresss', id);
                            this.removeAddress(id);
                          },
                        },
                        {
                          text: 'Cancelar',
                          onPress: () => console.log('Cancel Pressed'),
                          style: 'cancel',
                        },
                      ],
                      {cancelable: true},
                    );
                  }}
                />
              );
            })}

          {user && user.address && user.address.length <= 0 && (
            <View style={{marginVertical: 50}}>
              <Text
                style={Fonts.style.bold(
                  Colors.gray,
                  Fonts.size.small,
                  'center',
                )}>
                {'No tienes direcciones, agrega una para continuar.'}
              </Text>
            </View>
          )}

          <TouchableOpacity
            onPress={() => {
              this.props.addAddress();
            }}
            style={styles.productContainer}>
            <Text
              style={Fonts.style.bold(
                Colors.client.primaryColor,
                Fonts.size.medium,
                'center',
              )}>
              {'+ Agregar direccion'}
            </Text>
          </TouchableOpacity>
          <View opacity={0.0} style={ApplicationStyles.separatorLine} />
        </ScrollView>
      </View>
    );
  }
}
