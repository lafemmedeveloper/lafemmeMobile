import React, {useContext, useEffect, useState} from 'react';
import {View, ScrollView, Text} from 'react-native';
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

const Home = () => {
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

  const selectService = (product) => {
    if (user !== null) {
      navigation.navigate('ProductDetail', {product, user, authDispatch});
    } else {
      setModalAuth(true);
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
        <Text>Cart</Text>
      </ModalApp>
    </>
  );
};

export default Home;
