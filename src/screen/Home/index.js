import React, {useContext, useEffect, useState} from 'react';
import {View, ScrollView} from 'react-native';
import styles from './styles';
import ExpandHome from '../../components/ExpandHome';
import {Metrics, ApplicationStyles, Images} from '../../themes';
import {StoreContext} from '../../flux';
import {getServices} from '../../flux/services/actions';
import {useNavigation} from '@react-navigation/native';
import ModalApp from '../../components/ModalApp';
import Login from '../Login';
import {observeUser} from '../../flux/auth/actions';
import BannerScroll from '../../components/BannerScroll';
import Gallery from '../Gallery';
import CartFooter from '../../components/CartFooter';
import _ from 'lodash';
import CartScreen from '../CartScreen';
import Address from '../Address';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import AddAddress from '../AddAddress';

const Home = () => {
  const TIME_SET = 500;

  const navigation = useNavigation();
  const {state, serviceDispatch, authDispatch, utilDispatch} = useContext(
    StoreContext,
  );
  const {service, auth, util} = state;
  const {user} = auth;
  console.log('usuario current=>', user);

  useEffect(() => {
    observeUser(authDispatch);
  }, []);

  useEffect(() => {
    getServices(serviceDispatch);
  }, []);

  const {services} = service;
  const [modalAuth, setModalAuth] = useState(false);
  const [modalInspo, setModalInspo] = useState(false);
  const [modalCart, setModalCart] = useState(false);
  const [modalAddress, setModalAddress] = useState(false);
  const [isModalCart, setIsModalCart] = useState(false);
  const [modalAddAddress, setModalAddAddress] = useState(false);

  const selectService = (product) => {
    if (user !== null) {
      if (user && user.cart && user.cart.address) {
        navigation.navigate('ProductDetail', {product, user});
      } else {
        setModalAddress(true);
      }
    } else {
      setModalAddress(true);
    }
  };
  const addAddressState = () => {
    setIsModalCart(false);
    setModalAddress(true);
  };
  const closeModal = () => {
    setModalAddress(false);

    if (isModalCart) {
      setTimeout(function () {
        modalCart(true);
      }, TIME_SET);
    }
  };
  return (
    <>
      <View style={styles.container}>
        {/*   <Header title={'Agrega una dirección'} user={user} /> */}
        <ScrollView
          style={[ApplicationStyles.scrollHome, {marginTop: Metrics.header}]}
          bounces={true}>
          {services &&
            services.length > 0 &&
            services.map((data) => {
              return (
                <ExpandHome
                  key={data.id}
                  data={data}
                  image={{uri: data.imageUrl}}
                  selectService={(data) => selectService(data)}
                />
              );
            })}
          {services && (
            <BannerScroll
              key={'banner'}
              name={'INSPO'}
              subtitle={'Busca inspiración para tu próxima cita'}
              image={Images.banner}
              selectBanner={() => setModalInspo(true)}
            />
          )}
        </ScrollView>
      </View>

      {user && user.cart.length > 0 && (
        <View
          style={{
            width: Metrics.screenWidth,
            height: 50,
            bottom: 0,
            backgroundColor: 'transparet',
            position: 'absolute',
          }}>
          <CartFooter
            key={'CartFooter'}
            title={'Completar orden'}
            servicesNumber={
              user && user.cart && user.cart ? user.cart.length : 0
            }
            servicesTotal={
              user && user.cart && user.cart.length > 0
                ? _.sumBy(user.cart, 'total')
                : 0
            }
            onAction={() => setModalCart(true)}
          />
        </View>
      )}

      {/* Modals */}
      <ModalApp open={modalAuth} setOpen={setModalAuth}>
        <Login setModalAuth={setModalAuth} />
      </ModalApp>

      <ModalApp open={modalInspo} setOpen={setModalInspo}>
        <Gallery
          state={util}
          dispatch={utilDispatch}
          setModalInspo={setModalInspo}
        />
      </ModalApp>

      <ModalApp open={modalCart} setOpen={setModalCart}>
        <CartScreen setModalCart={setModalCart} />
      </ModalApp>

      <ModalApp open={modalAddress} setOpen={setModalAddress}>
        <Address addAddressState={addAddressState} closeModal={closeModal} />
      </ModalApp>

      <ModalApp open={modalAddAddress} setOpen={setModalAddAddress}>
        <>
          <TouchableOpacity
            style={{
              alignSelf: 'center',
              justifyContent: 'center',
              alignItems: 'center',
              width: 30,
              marginVertical: 8,
              backgroundColor: Colors.light,
              height: 4,
              borderRadius: 2.5,
            }}
            onPress={() => setModalAddAddress(false)}
          />
          <View
            style={{
              // paddingTop: Metrics.addHeader,
              alignSelf: 'center',
              width: Metrics.screenWidth,
              height: Metrics.screenHeight * 0.85,
              backgroundColor: Colors.light,
              backdropColor: 'red',
              borderTopRightRadius: 10,
              borderTopLeftRadius: 10,
            }}>
            <AddAddress
              addAddress={() => setModalAddAddress(true)}
              closeAddAddress={() => setModalAddAddress(false)}
            />
          </View>
        </>
      </ModalApp>

      {/* Modals close */}
    </>
  );
};

export default Home;
