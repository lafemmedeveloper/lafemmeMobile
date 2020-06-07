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
import {setLoading} from '../../Core/UI/Actions';
import ServiceItemBanner from '../../Components/ServiceItemBanner';

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    const {
      getExpertOpenOrders,
      getExpertActiveOrders,
      getExpertHistoryOrders,
      setLoading,
    } = this.props;

    await getExpertOpenOrders();
    await getExpertHistoryOrders();
    await getExpertActiveOrders();
    setLoading(false);
  }

  render() {
    const {
      logOut,
      user,
      appType,
      loading,
      expertOpenOrders,
      expertActiveOrders,
      assignExpert,
    } = this.props;
    const {} = this.state;

    if (user && user.roles.indexOf('expert') === -1) {
      return <ClientOnExpert />;
    }

    if (!user) {
      return null;
    } else {
      return (
        <View style={styles.container}>
          {expertActiveOrders.length > 0 ? (
            <ServiceItemBanner
              item={expertActiveOrders[0]}
              appType={appType}
              onPress={() => {}}
            />
          ) : (
            <View style={{marginTop: Metrics.addHeader}} />
          )}
          {expertOpenOrders.length > 0 ? (
            <ScrollView
              style={[ApplicationStyles.scrollHomeExpert, {flex: 1}]}
              bounces={true}>
              {/* <View style={{height: Metrics.addHeader}}></View> */}
              {expertOpenOrders.map((item, index) => {
                console.log(item);
                return (
                  <View key={item.id}>
                    <ExpertDealOffer
                      order={item}
                      user={user}
                      onSwipe={() => {
                        console.log('ExpertDealOffer:home');
                        setLoading(true);
                        let expertData = {
                          coordinates: {
                            latitude: 6.2458007,
                            longitude: -75.5680003,
                          },
                          id: user.id,
                          ranking: user.ranking,
                          lastName: user.lastName,
                          firstName: user.firstName,
                          image: user.pics.image,
                          thumbnail: user.pics.thumbnail,
                        };

                        assignExpert(item.id, index, expertData);
                      }}
                    />
                  </View>
                );
              })}
            </ScrollView>
          ) : (
            <View
              style={{
                flex: 1,
                paddingHorizontal: 30,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={Fonts.style.semiBold(
                  Colors.dark,
                  Fonts.size.h6,
                  'center',
                )}>
                {'No hay ordenes actualmente'}
              </Text>
              <Text
                style={Fonts.style.regular(
                  Colors.dark,
                  Fonts.size.medium,
                  'center',
                )}>
                {
                  'Este pendiente de las notificaciones que te avisaremos cuando tengamos nuevos clientes'
                }
              </Text>
            </View>
          )}
        </View>
      );
    }
  }
}
