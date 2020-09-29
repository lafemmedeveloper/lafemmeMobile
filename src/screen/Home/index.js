import React, {useContext, useEffect, useState} from 'react';
import {View, ScrollView, StyleSheet, StatusBar} from 'react-native';
import ExpandHome from '../../components/ExpandHome';
import {Metrics, Images, Colors} from '../../themes';
import {StoreContext} from '../../flux';
import {getServices} from '../../flux/services/actions';
import {useNavigation} from '@react-navigation/native';
import ModalApp from '../../components/ModalApp';
import Login from '../Login';
import {activeMessage} from '../../flux/auth/actions';
import BannerScroll from '../../components/BannerScroll';
import Gallery from '../Gallery';
import CartFooter from '../../components/CartFooter';
import _ from 'lodash';
import CartScreen from '../CartScreen';
import Address from '../Address';
import AddAddress from '../AddAddress';
import Header from '../../components/Header';
import {getGallery, getOrders, getDeviceInfo} from '../../flux/util/actions';
import Loading from '../../components/Loading';

const Home = () => {
  const TIME_SET = 500;
  const navigation = useNavigation();
  const {state, serviceDispatch, authDispatch, utilDispatch} = useContext(
    StoreContext,
  );
  const {service, util} = state;
  const {user} = state.auth;
  const {services} = service;
  const {deviceInfo, orders} = util;
  console.log(
    'usuario current=>',
    user ? user : '=========User is Empty============',
  );

  const appType = deviceInfo;

  const [modalAuth, setModalAuth] = useState(false);
  const [modalInspo, setModalInspo] = useState(false);
  const [modalCart, setModalCart] = useState(false);
  const [modalAddress, setModalAddress] = useState(false);
  const [isModalCart, setIsModalCart] = useState(false);
  const [modalAddAddress, setModalAddAddress] = useState(false);

  useEffect(() => {
    activeFunctionsFlux();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activeFunctionsFlux = async () => {
    getDeviceInfo(utilDispatch);

    await getServices(serviceDispatch);
    activeMessage(authDispatch);
    getOrders(utilDispatch);
    getGallery(utilDispatch);
  };

  const selectService = (product) => {
    if (user !== null) {
      if (user && user.cart && user.cart.address) {
        navigation.navigate('ProductDetail', {product});
      } else {
        setModalAddress(true);
      }
    } else {
      setModalAuth(true);
    }
  };

  const addAddressState = () => {
    setIsModalCart(false);
    setModalAddAddress(true);
  };
  const closeModal = () => {
    setModalAddress(false);

    if (isModalCart) {
      setTimeout(function () {
        modalCart(true);
      }, TIME_SET);
    }
  };

  const openModalAddress = () => {
    if (user) {
      setModalAddress(true);
    } else {
      setModalAuth(true);
    }
  };
  return (
    <>
      <StatusBar backgroundColor={Colors.client.primaryColor} />
      <Loading type={'client'} />
      <View style={styles.container}>
        <Header
          appType={appType}
          title={'Agrega una dirección'}
          iconL={null}
          iconR={null}
          user={user}
          ordersActive={orders.length}
          selectAddress={() => openModalAddress()}
          onActionL={() => {}}
          onActionR={() => {}}
        />
        <ScrollView style={[styles.scroll]} bounces={true}>
          {services &&
            services.length > 0 &&
            services.map((data) => {
              return (
                <ExpandHome
                  key={data.id}
                  data={data}
                  image={{uri: data.imageUrl}}
                  slug={data.slug}
                  selectService={(data) => selectService(data)}
                />
              );
            })}
          {services && services.length > 0 && (
            <BannerScroll
              key={'banner'}
              name={'INSPO'}
              subtitle={'Busca inspiración para tu próxima cita'}
              image={Images.banner}
              selectBanner={() => setModalInspo(true)}
            />
          )}
          <View style={{height: 50}} />
        </ScrollView>
      </View>

      {user && user.cart && (
        <View
          style={{
            width: Metrics.screenWidth,
            height: 50,
            bottom: 0,
            backgroundColor: 'transparent',
            position: 'absolute',
          }}>
          <CartFooter
            key={'CartFooter'}
            title={'Completar orden'}
            servicesNumber={
              user && user.cart && user.cart.services
                ? user.cart.services.length
                : 0
            }
            servicesTotal={
              user &&
              user.cart &&
              user.cart.services &&
              user.cart.services.length > 0
                ? _.sumBy(user.cart.services, 'total')
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
        <Gallery />
      </ModalApp>

      <ModalApp open={modalCart} setOpen={setModalCart}>
        <CartScreen
          setModalCart={setModalCart}
          setModalAddress={setModalAddress}
        />
      </ModalApp>

      <ModalApp open={modalAddress} setOpen={setModalAddress}>
        <Address
          addAddressState={addAddressState}
          closeModal={closeModal}
          setModalAddAddress={setModalAddAddress}
          setModalCart={setModalCart}
        />
      </ModalApp>

      <ModalApp open={modalAddAddress} setOpen={setModalAddAddress}>
        <AddAddress
          addAddress={() => setModalAddAddress(true)}
          closeAddAddress={() => setModalAddAddress(false)}
          setModalCart={setModalCart}
        />
      </ModalApp>

      {/* Modals close */}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: Metrics.screenWidth,
    height: Metrics.screenHeight,
    backgroundColor: Colors.backgroundColor,
  },
  scroll: {width: Metrics.screenWidth, flex: 1, paddingBottom: 10},
});

export default Home;
