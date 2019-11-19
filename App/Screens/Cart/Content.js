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
import CardItemCart from '../../Components/CardItemCart';
import FieldCartConfig from '../../Components/FieldCartConfig';
import styles from './styles';
import {ScrollView} from 'react-native-gesture-handler';

import {validateCoverage} from '../../Helpers/GeoHelper';

import {msToDate, msToDay, msToHour} from '../../Helpers/MomentHelper';

var locationIcon = {
  0: 'home',
  1: 'building',
  2: 'concierge-bell',
  3: 'map-pin',
};

export default class Cart extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    const {getCoverage, setLoading} = this.props;
    setLoading(true);
    await getCoverage('Medellín');
    setLoading(false);
  }

  async removeCartItem(id) {
    const {user, updateProfile, setLoading} = this.props;

    let services = user.cart.services;

    const index = services ? services.findIndex(i => i.id === id) : -1;

    if (index !== -1) {
      services = [...services.slice(0, index), ...services.slice(index + 1)];

      setLoading(true);

      await updateProfile({...user.cart, services}, 'cart');

      setLoading(false);
    }
  }
  async uploadCoverageZone() {
    console.log('uploadCoverageZones');
    var coverage = require('../../Config/Poligons.json');

    console.log('coverage', coverage);

    for (let index = 0; index < coverage.length; index++) {
      console.log(coverage[index].id, index, '/', coverage.length);

      await firestore()
        .collection('coverageZones')
        .doc(coverage[index].id)
        .set(
          {
            ...coverage[index],
          },
          {merge: true},
        );
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
              style={Fonts.style.regular(Colors.dark, Fonts.size.h6, 'center')}>
              {'Detalles de la Orden'}
            </Text>
            <View opacity={0.0} style={ApplicationStyles.separatorLine} />
          </View>

          {user &&
            user.cart &&
            user.cart.services &&
            user.cart.services.map((item, index) => {
              return (
                <CardItemCart
                  key={index}
                  data={item}
                  removeItem={id => {
                    Alert.alert(
                      'Alerta',
                      'Realmente desea eliminar este item de tu lista.',
                      [
                        {
                          text: 'Eliminar',
                          onPress: () => {
                            console.log('removeItem', id);
                            this.removeCartItem(id);
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
              {'+ Agregar mas servicios'}
            </Text>
          </TouchableOpacity>
          <View opacity={0.0} style={ApplicationStyles.separatorLine} />
          {user && user.cart && (
            <>
              <View style={styles.itemTitleContainer}>
                <Text
                  style={Fonts.style.regular(
                    Colors.client.primartColor,
                    Fonts.size.medium,
                    'left',
                  )}>
                  {'Ubicacion del servicio'}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  this.props.modalAddress();
                }}>
                <FieldCartConfig
                  key={'address'}
                  value={user.cart.address ? user.cart.address : false}
                  textActive={
                    user.cart.address && `${user.cart.address.formattedAddress}`
                  }
                  textSecondary={
                    user.cart.address && user.cart.address.addressDetail
                      ? `${user.cart.address.addressDetail}`
                      : ''
                  }
                  textInactive={'+ Agregar una dirección'}
                  icon={
                    user.cart.address
                      ? locationIcon[user.cart.address.type]
                      : 'map-marker-alt'
                  }
                />
              </TouchableOpacity>
              <View style={styles.itemTitleContainer}>
                <Text
                  style={Fonts.style.regular(
                    Colors.client.primartColor,
                    Fonts.size.medium,
                    'left',
                  )}>
                  {'Fecha y hora del servicio'}
                </Text>
                <Text
                  style={Fonts.style.regular(
                    Colors.gray,
                    Fonts.size.small,
                    'left',
                  )}>
                  {'Selecciona un rango de horas para iniciar el servicio'}
                </Text>
              </View>
              <FieldCartConfig
                key={'date'}
                textSecondary={''}
                value={user.cart.date ? user.cart.date : false}
                textActive={`${msToDay(
                  user.cart.date.startDate.seconds,
                )}\nHora de inicio entre ${msToHour(
                  user.cart.date.startDate.seconds,
                )} y ${msToHour(user.cart.date.endDate.seconds)}`}
                textInactive={'+ Selecciona la fecha del servicio'}
                icon={'calendar'}
              />
              <View style={styles.itemTitleContainer}>
                <Text
                  style={Fonts.style.regular(
                    Colors.client.primartColor,
                    Fonts.size.medium,
                    'left',
                  )}>
                  {'Notas y fotografias'}
                </Text>
              </View>
              <FieldCartConfig
                key={'comments'}
                textSecondary={''}
                value={user.cart.notes ? user.cart.notes : false}
                textActive={user.cart.notes}
                textInactive={'+ Agregar notas o fotografias'}
                icon={'comment-alt'}
              />
            </>
          )}
          <View opacity={0.0} style={ApplicationStyles.separatorLine} />

          <TouchableOpacity
            onPress={() => {
              this.uploadCoverageZone();
            }}>
            <Text>uploadCoverageZone</Text>
          </TouchableOpacity>
        </ScrollView>

        <View style={styles.footerContainer}>
          <TouchableOpacity onPress={() => {}} style={styles.btnContainer}>
            <Text
              style={Fonts.style.bold(
                Colors.light,
                Fonts.size.medium,
                'center',
              )}>
              {'Finalizar Orden'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
