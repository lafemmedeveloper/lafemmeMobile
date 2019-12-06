/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Keyboard,
  ScrollView,
} from 'react-native';
import moment from 'moment';
import LinearGradient from 'react-native-linear-gradient';
import _ from 'lodash';
import {
  Colors,
  Fonts,
  Images,
  Metrics,
  ApplicationStyles,
  FlatList,
} from '../../Themes';

import styles from './styles';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AutoHeightImage from 'react-native-auto-height-image';
import Header from '../../Components/Header';
import CartFooter from '../../Components/CartFooter';
import GalleryItem from '../../Components/GalleryItem';
import ExpandHome from '../../Components/ExpandHome';
import BannerScroll from '../../Components/BannerScroll';

import Login from '../../Screens/Login';
import Cart from '../../Screens/Cart';
import Orders from '../../Screens/Orders';
import Address from '../../Screens/Address';
import AddAddress from '../../Screens/AddAddress';
import Register from '../../Screens/Register';

import StarRating from 'react-native-star-rating';
import Modal from 'react-native-modal';
import auth from '@react-native-firebase/auth';

import FastImage from 'react-native-fast-image';
import Loading from '../../Components/Loading';
import {green} from 'ansi-colors';
import {formatDate} from '../../Helpers/MomentHelper';

var orderStatusStr = {
  0: 'Buscando Expertos',
  1: 'Preparando Servicio',
  2: 'En Ruta',
  3: 'En servicio',
  4: 'Esperando Calificacion',
  5: 'Finalizado',
  6: 'Cancelado',
};

var locationIcon = {
  0: 'home',
  1: 'building',
  2: 'concierge-bell',
  3: 'map-pin',
};

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    const {} = this.props;

    console.log('componentDidMount');
  }

  render() {
    const {} = this.props;
    const {} = this.state;

    return (
      <View style={styles.container}>
        <ScrollView style={ApplicationStyles.scrollHome} bounces={true}>
          <View style={{width: 200, height: 500, backgroundColor: 'red'}} />
        </ScrollView>
      </View>
    );
  }
}
