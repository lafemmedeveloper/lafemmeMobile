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
import AddAddress from '../AddAddress';
import Header from '../../components/Header';
import {getOrders} from '../../flux/util/actions';

const Home = () => {
  const TIME_SET = 500;

  const navigation = useNavigation();
  const {state, serviceDispatch, authDispatch, utilDispatch} = useContext(
    StoreContext,
  );
  const {service, auth, util} = state;

  const {user} = auth;
  const {services} = service;
  const {deviceInfo, orders} = util;
  console.log(
    'usuario current=>',
    user ? user : '=========User is Empty============',
  );

  const appType = deviceInfo;

  useEffect(() => {
    activefuntionsFlux();
  }, []);

  const [modalAuth, setModalAuth] = useState(false);
  const [modalInspo, setModalInspo] = useState(false);
  const [modalCart, setModalCart] = useState(false);
  const [modalAddress, setModalAddress] = useState(false);
  const [isModalCart, setIsModalCart] = useState(false);
  const [modalAddAddress, setModalAddAddress] = useState(false);

  async function activefuntionsFlux() {
    observeUser(authDispatch);
    await getServices(serviceDispatch);
    getOrders(utilDispatch);
  }
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

  console.log('orders =>', orders);
  return (
    <>
      <View style={styles.container}>
        <Header
          appType={appType}
          title={'Agrega una dirección'}
          iconL={null}
          iconR={null}
          user={user}
          ordersActive={orders.length}
          selectAddress={() => setModalAddress(true)}
          onActionL={() => {}}
          onActionR={() => {}}
        />
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
                  slug={data.slug}
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

      {user && user.cart && (
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
        <Gallery
          state={util}
          dispatch={utilDispatch}
          setModalInspo={setModalInspo}
        />
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

export default Home;
