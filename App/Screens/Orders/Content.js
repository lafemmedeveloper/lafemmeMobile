import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  Alert,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import firestore from '@react-native-firebase/firestore';
import {Colors, Images, Fonts, ApplicationStyles, Metrics} from '../../Themes';
import auth from '@react-native-firebase/auth';
import MyTextInput from '../../Components/MyTextInput';
import CardItemCart from '../../Components/CardItemCart';
import FieldCartConfig from '../../Components/FieldCartConfig';
import styles from './styles';
import {ScrollView} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome5';

import ExpandOrderData from '../../Components/ExpandOrderData';
import ExpandHistoryData from '../../Components/ExpandHistoryData';

import {getDate, formatDate} from '../../Helpers/MomentHelper';
import DatePicker from 'react-native-datepicker';
import _ from 'lodash';
import Utilities from '../../Utilities';
import {msToDate, msToDay, msToHour} from '../../Helpers/MomentHelper';
import moment from 'moment';
import MapView, {
  PROVIDER_GOOGLE,
  Marker,
  AnimatedRegion,
} from 'react-native-maps';
var locationIcon = {
  0: 'home',
  1: 'building',
  2: 'concierge-bell',
  3: 'map-pin',
};

const config = {
  minHour: moment('08:00').format('HH:mm'),
  maxHour: moment('20:00').format('HH:mm'),
};

const screen = Dimensions.get('window');
const ASPECT_RATIO = screen.width * 0.8 - 500 / screen.height;
const LATITUDE_DELTA = 0.0003;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const mapStyle = require('../../Config/mapStyle.json');

var orderStatusStr = {
  0: 'Buscando Expertos',
  1: 'Preparando Servicio',
  2: 'En Ruta',
  3: 'En servicio',
  4: 'Esperando Calificacion',
  5: 'Finalizado',
  6: 'Cancelado',
};

export default class Cart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toggleType: 0,
      date: getDate(1),
      day: getDate(1),
      hour: moment(new Date())
        .add(1.5, 'hour')
        .format('HH:mm'),
    };
  }

  async componentDidMount() {
    const {getCoverage, setLoading} = this.props;
    setLoading(true);
    await getCoverage('Medellín');
    setLoading(false);
  }

  async sendOrder(data) {
    const {user, updateProfile, setLoading} = this.props;
    setLoading(true);
    try {
      firestore()
        .collection('orders')
        .doc()
        .set(data)
        .then(function() {
          console.log('order:Created');

          try {
            updateProfile(
              {
                ...orders[0],
                day: null,
                address: null,
                hour: null,
                notes: null,
                services: [],
                coupon: null,
              },
              'cart',
            );
          } catch (error) {}
        })
        .catch(function(error) {
          console.error('Error saving order : ', error);
        });

      // await firestore()
      //   .collection('orders')
      //   .set(data);
      // setLoading(false);
    } catch (error) {
      console.log('sendOrder:error', error);
    }
    this.props.closeModal();
    setLoading(false);
  }

  async removeCartItem(id) {
    const {user, updateProfile, orders, setLoading} = this.props;

    let services = orders[0].services;

    const index = services ? services.findIndex(i => i.id === id) : -1;

    if (index !== -1) {
      services = [...services.slice(0, index), ...services.slice(index + 1)];

      setLoading(true);

      await updateProfile({...orders[0], services}, 'cart');

      setLoading(false);
    }
  }

  async cancelOrder(id) {
    const {user, updateProfile, orders, setLoading} = this.props;
    setLoading(true);

    console.log('cancelOrder', id);
    // try {
    //   await updateProfile({...orders[0], day}, 'cart');
    //   this.setState({day});
    // } catch (err) {
    //   console.log('updateDay:error', err);
    // }

    setLoading(false);
  }

  render() {
    const {user, orders, history} = this.props;
    const {toggleType} = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <View opacity={0.0} style={ApplicationStyles.separatorLine} />
          <Text style={Fonts.style.bold(Colors.dark, Fonts.size.h6, 'center')}>
            {'Orden de Servicio'}
          </Text>
          <View opacity={0.0} style={ApplicationStyles.separatorLine} />
        </View>
        <View
          style={{
            width: Metrics.screenWidth * 0.9,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignSelf: 'center',
          }}>
          <TouchableOpacity
            onPress={() => {
              this.setState({toggleType: 0});
            }}
            style={[
              styles.headerBtn,
              {
                backgroundColor:
                  toggleType === 0 ? Colors.client.primartColor : Colors.gray,
              },
            ]}>
            <Text
              style={Fonts.style.bold(
                Colors.light,
                Fonts.size.medium,
                'center',
              )}>
              {'Mi Próximos Servicios'}
            </Text>
          </TouchableOpacity>
          <View style={{width: 5}}></View>
          <TouchableOpacity
            onPress={() => {
              this.setState({toggleType: 1});
            }}
            style={[
              styles.headerBtn,
              {
                backgroundColor:
                  toggleType === 1 ? Colors.client.primartColor : Colors.gray,
              },
            ]}>
            <Text
              style={Fonts.style.bold(
                Colors.light,
                Fonts.size.medium,
                'center',
              )}>
              {'Historial'}
            </Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.contentContainer}>
          {toggleType === 0 &&
            orders.map((item, index) => {
              return (
                <>
                  <ExpandOrderData key={index} user={user} order={item} />

                  {index < orders.length - 1 && (
                    <View
                      opacity={0.0}
                      style={ApplicationStyles.separatorLine}
                    />
                  )}
                </>
              );
            })}
          {toggleType === 1 &&
            history.map((item, index) => {
              return (
                <>
                  <ExpandHistoryData key={index} user={user} order={item} />
                </>
              );
            })}

          <View style={{height: Metrics.addFooter + 20}} />
        </ScrollView>
      </View>
    );
  }
}
