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

import ExpertDealOffer from '../../Components/ExpertDealOffer';
import ClientOnExpert from '../ClientOnExpert';

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    const {getExpertOpenOrders, setLoading} = this.props;

    await getExpertOpenOrders();
    setLoading(false);
    console.log('componentDidMount');
  }

  render() {
    const {logOut, user, expertOpenOrders} = this.props;
    const {} = this.state;

    if (user && user.roles.indexOf('expert') === -1) {
      return <ClientOnExpert />;
    }

    if (!user) {
      return null;
    } else {
      return (
        <View style={styles.container}>
          <View style={styles.bannerExpert} />
          <ScrollView style={ApplicationStyles.scrollHomeExpert} bounces={true}>
            {/* <View style={{height: Metrics.addHeader}}></View> */}
            {expertOpenOrders.map((item, index) => {
              return (
                <View key={item.id}>
                  <ExpertDealOffer order={item} />
                </View>
              );
            })}
          </ScrollView>
          <TouchableOpacity
            onPress={() => {
              console.log('logOut');
              logOut();
            }}>
            <Text>logOut</Text>
          </TouchableOpacity>
        </View>
      );
    }
  }
}
