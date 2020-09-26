import React, {useContext, useState, useEffect} from 'react';
import {Text, View, StyleSheet} from 'react-native';

import {Fonts, Colors} from '../../../../themes';
import {StoreContext} from '../../../../flux';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {
  addImageGallery,
  setLoading,
  updateStatus,
} from '../../../../flux/util/actions';
import moment from 'moment';
import ModalApp from '../../../../components/ModalApp';
import ModalPhoto from './ModalPhoto';

const ServiceFinish = (props) => {
  const {id, goBack} = props;

  const {state, utilDispatch} = useContext(StoreContext);
  const [expert, setExpert] = useState(null);
  const [orderId, setOrderId] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);

  const {util, auth} = state;
  const {user} = auth;

  const {orders} = util;

  useEffect(() => {
    if (orders.length > 0) {
      const currentOrder = orders.filter((item) => item.cartId === id)[0];
      setOrderId(currentOrder);
      setExpert(currentOrder.experts);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log('expert ===>', expert);

  const changeStatus = async (status) => {
    await updateStatus(status, orderId.id, utilDispatch);
  };

  const updateUser = async (picture) => {
    const images = {...picture};
    const id = orderId.cartId;

    const dataExpert = {
      clientUid: user.uid,
      expertUid: expert.uid,
      orderId: orderId.id,
      expertName: expert.firstName,
      expertImage: expert.imageUrl.small,
      clientName: user.firstName,
      rating: expert.rating,
      date: moment().format(),
      imageUrl: images,
      service: orderId.servicesType,
      isApproved: false,
    };
    await addImageGallery(dataExpert, id, utilDispatch);
  };
  return (
    <>
      <View style={styles.container}>
        <Text
          style={Fonts.style.regular(
            Colors.lightGray,
            Fonts.size.input,
            'left',
          )}>
          {'Buscando experto'}
        </Text>
        <Text
          style={[
            Fonts.style.regular(Colors.lightGray, Fonts.size.h6, 'left'),
            {marginTop: 10},
          ]}>
          {'Preparando tu orden'}
        </Text>

        <Text
          style={[
            Fonts.style.regular(Colors.lightGray, Fonts.size.regular, 'left'),
            {marginTop: 10},
          ]}>
          {'Tu experto va en camino'}
        </Text>
        <Text
          style={[
            Fonts.style.bold(
              Colors.client.primaryColor,
              Fonts.size.regular,
              'center',
            ),
            {marginTop: 10},
          ]}>
          {'Servicio finalizado'}
        </Text>
      </View>

      <TouchableOpacity style={styles.btn} onPress={() => setModalOpen(true)}>
        <Text
          style={[Fonts.style.bold(Colors.light, Fonts.size.input, 'center')]}>
          {'Tomar foto del servicio'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btn2} onPress={() => changeStatus(5)}>
        <Text
          style={[
            Fonts.style.bold(
              Colors.client.primaryColor,
              Fonts.size.input,
              'center',
            ),
          ]}>
          Omitir{' '}
        </Text>
      </TouchableOpacity>
      <ModalApp open={modalOpen} setOpen={setModalOpen}>
        <ModalPhoto
          updateUser={updateUser}
          utilDispatch={utilDispatch}
          user={user}
          setLoading={setLoading}
          close={setModalOpen}
          goBack={goBack}
          changeStatus={changeStatus}
        />
      </ModalApp>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 20,
  },
  contExpert: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    position: 'absolute',
    top: 0,
  },
  btn: {
    backgroundColor: Colors.client.primaryColor,
    width: '90%',
    height: 40,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  btn2: {
    backgroundColor: Colors.lightGray,
    width: '90%',
    height: 40,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 20,
  },
  contentPhoto: {
    marginBottom: -200,
  },
});

export default ServiceFinish;
